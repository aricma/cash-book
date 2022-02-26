import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import * as SettingsState from '../../features/settings/state';
import * as BookingsState from '../../features/bookEntries/state';
import * as AccountsState from '../../features/accounts/state';
import * as TransactionsState from '../../features/transactions/state';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const initialAppState = {
	settings: SettingsState.initialState,
	bookEntries: BookingsState.initialState,
	accounts: AccountsState.initialState,
	transactions: TransactionsState.initialState,
};

export const makeResetWorker = (
	setInLocalStorage: (key: string, value: string) => void,
	getUserConfirm: () => boolean
) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_RESET);
				if (!getUserConfirm()) continue;
				setInLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(initialAppState));
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
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
