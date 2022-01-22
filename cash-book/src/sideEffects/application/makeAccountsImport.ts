import {AccountsImport, ApplicationActionType} from '../../applicationState/actions';
import * as SE from 'redux-saga/effects';
import {ApplicationState, selectAppState} from '../../applicationState';


export const makeAccountsImport = () => {
    return function* worker() {
        while (true) {
            try {
                const action: AccountsImport = yield SE.take(ApplicationActionType.ACCOUNTS_IMPORT);
                const appState: ApplicationState = yield SE.select(selectAppState);
                yield SE.put({
                    type: ApplicationActionType.ACCOUNTS_SET,
                    state: {
                        ...appState.accounts,
                        accounts: {
                            ...appState.accounts.accounts,
                            ...action.accounts,
                        },
                    },
                });
            } catch (e) {
                console.log(e);
            }
        }
    };
};
