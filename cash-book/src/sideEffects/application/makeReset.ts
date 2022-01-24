import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import * as SettingsState from '../../features/settings/state';
import * as BookingsState from '../../features/bookEntries/state';
import * as AccountsState from '../../features/accounts/state';
import * as TransactionsState from '../../features/transactions/state';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeReset = (setInLocalStorage: (key: string, value: string) => void) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_RESET);
				const noUserConsent = !window.confirm(
					'Do you really want to reset your app? Everything will be deleted! This action can not be undone!'
				);
				if (noUserConsent) continue;
				const value = JSON.stringify({
					settings: SettingsState.initialState,
					bookEntries: BookingsState.initialState,
					accounts: AccountsState.initialState,
					transactions: TransactionsState.initialState,
				});
				setInLocalStorage(LOCAL_STORAGE_KEY, value);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
				});
			} catch (e) {
				console.log(e);
			}
		}
	};
};
