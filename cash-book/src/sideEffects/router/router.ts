import * as SE from 'redux-saga/effects';
import { ApplicationActionType, RouterGoTo } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { ROUTES_ACCOUNTS, ROUTES_TRANSACTIONS, ROUTES_CREATE_BOOK_ENTRY, ROUTES_SUPPORT } from '../../variables/routes';
import { DOCS_SUPPORT } from '../../variables/externalLinks';

export interface MakeGoToWorkerRequest {
	goTo: (path: string) => void;
	goToExternal: (path: string) => void;
	scrollToTheTop: () => void;
}

export const makeGoToWorker = (request: MakeGoToWorkerRequest) => {
	return function* worker() {
		while (true) {
			const action: RouterGoTo = yield SE.take(ApplicationActionType.ROUTER_GO_TO);
			switch (action.path) {
				case ROUTES_SUPPORT:
					request.goToExternal(DOCS_SUPPORT);
					break;
				default:
					request.goTo(action.path);
					request.scrollToTheTop();
					break;
			}
		}
	};
};

export const makeFallbackWorker = () => {
	return function* worker() {
		while (true) {
			yield SE.take(ApplicationActionType.ROUTER_FALLBACK);
			const appState: ApplicationState = yield SE.select(selectAppState);
			const hasNoAccount = Object.keys(appState.accounts.accounts).length === 0;
			const hasNoTransactions = Object.keys(appState.transactions.templates).length === 0;
			switch (true) {
				case hasNoAccount:
					yield SE.put({ type: ApplicationActionType.ROUTER_GO_TO, path: ROUTES_ACCOUNTS });
					break;
				case hasNoTransactions:
					yield SE.put({ type: ApplicationActionType.ROUTER_GO_TO, path: ROUTES_TRANSACTIONS });
					break;
				default:
					yield SE.put({ type: ApplicationActionType.ROUTER_GO_TO, path: ROUTES_CREATE_BOOK_ENTRY });
					break;
			}
		}
	};
};
