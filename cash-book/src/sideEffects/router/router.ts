import * as SE from 'redux-saga/effects';
import { ApplicationActionType, RouterGoTo } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { ROUTES_ACCOUNTS, ROUTES_TRANSACTIONS, ROUTES_CREATE_BOOK_ENTRY, ROUTES_SUPPORT } from '../../variables/routes';
import { DOCS_SUPPORT } from '../../variables/externalLinks';

export const makeGoToWorker = (goTo: (path: string) => void, goToExternal: (path: string) => void) => {
	return function* worker() {
		while (true) {
			const action: RouterGoTo = yield SE.take(ApplicationActionType.ROUTER_GO_TO);
			switch (action.path) {
				case ROUTES_SUPPORT:
					goToExternal(DOCS_SUPPORT);
					break;
				default:
					goTo(action.path);
					break;
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
			const hasNoTransactions = Object.keys(appState.transactions.templates).length === 0;
			switch (true) {
				case hasNoAccount:
					goTo(ROUTES_ACCOUNTS);
					break;
				case hasNoTransactions:
					goTo(ROUTES_TRANSACTIONS);
					break;
				default:
					goTo(ROUTES_CREATE_BOOK_ENTRY);
					break;
			}
		}
	};
};
