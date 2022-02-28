import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';

export const makeResetWorker = (clearLocalStorage: () => void, getUserConfirm: () => boolean) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_RESET);
				if (!getUserConfirm()) continue;
				clearLocalStorage();
				yield SE.put({
					type: ApplicationActionType.APPLICATION_DEFAULT_SET,
				});
				yield SE.put({
					type: ApplicationActionType.SETTINGS_RESET,
				});
				yield SE.put({
					type: ApplicationActionType.ACCOUNTS_RESET,
				});
				yield SE.put({
					type: ApplicationActionType.TRANSACTIONS_RESET,
				});
				yield SE.put({
					type: ApplicationActionType.BOOK_ENTRIES_RESET,
				});
				yield SE.put({
					type: ApplicationActionType.ROUTER_FALLBACK,
				});
			} catch (error) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: error,
				});
			}
		}
	};
};
