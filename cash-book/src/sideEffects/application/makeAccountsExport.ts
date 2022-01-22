import * as SE from 'redux-saga/effects';
import {ApplicationActionType} from '../../applicationState/actions';
import {ApplicationState, selectAppState} from '../../applicationState';
import hash from 'crypto-js/sha256';
import {toCSVContent, exportToFile} from './utils';


export const makeAccountsExport = () => {
    return function* worker() {
        while (true) {
            try {
                yield SE.take(ApplicationActionType.ACCOUNTS_EXPORT);
                const appState: ApplicationState = yield SE.select(selectAppState);
                const headline = ['id', 'name', 'type', 'number'];
                const rows = Object.values(appState.accounts.accounts).map((account): Array<string> => {
                    return [account.id, account.name, account.type, account.number];
                });
                const unique = hash(new Date().toISOString());
                const fileName = `accounts-${unique}.csv`;
                exportToFile(toCSVContent([headline, ...rows]), fileName);
            } catch (e) {
                console.log(e);
            }
        }
    };
};
