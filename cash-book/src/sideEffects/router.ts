import * as SE from 'redux-saga/effects';
import {ApplicationActionType, RouterGoTo} from '../applicationState/actions';
import {ApplicationState, selectAppState} from '../applicationState';
import {history} from '../router';
import {ROUTES_ACCOUNTS, ROUTES_TRANSACTIONS, ROUTES_CREATE_BOOK_ENTRY, ROUTES_SUPPORT} from '../variables/routes';
import {DOCS_SUPPORT} from '../variables/externalLinks';


export function* routerBroker() {
    yield SE.spawn(makeGoToWorker(history.push));
    yield SE.spawn(makeFallbackWorker(history.push));
}

export const makeGoToWorker = (goTo: (path: string) => void) => {
    return function* worker() {
        while (true) {
            const action: RouterGoTo = yield SE.take(ApplicationActionType.ROUTER_GO_TO);
            if (action.path === ROUTES_SUPPORT) {
                window.open(DOCS_SUPPORT, '_blank');
            } else {
                goTo(action.path);
            }
        }
    };
};

export const makeFallbackWorker = (goTo: (path: string) => void) => {
    return function* worker() {
        while (true) {
            yield SE.take(ApplicationActionType.ROUTER_FALLBACK);
            const appState: ApplicationState = yield SE.select(selectAppState);
            const hasNoAccount = Object.keys(appState.accounts.accounts).length === 0;
            if (hasNoAccount) {
                goTo(ROUTES_ACCOUNTS);
                continue;
            }
            const hasNoTransactions = Object.keys(appState.transactions.templates).length === 0;
            if (hasNoTransactions) {
                goTo(ROUTES_TRANSACTIONS);
                continue;
            }
            goTo(ROUTES_CREATE_BOOK_ENTRY);
        }
    };
};
