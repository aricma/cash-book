import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../applicationState/actions';
import { SettingsSaveType } from '../features/settings/state';
import { ApplicationState, selectAppState } from '../applicationState';
import { LOCAL_STORAGE_KEY } from '../variables/environments';

export const makeSaveAppStateToLocalStorage = (
	setInLocalStorage: (key: string, value: string) => void
) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take([
					ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
					ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
					ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
					ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
					ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,

					ApplicationActionType.TRANSACTIONS_CREATE_SET_TYPE,
					ApplicationActionType.TRANSACTIONS_CREATE_SET_NAME,
					ApplicationActionType.TRANSACTIONS_CREATE_SET_CASHIER_ACCOUNT,
					ApplicationActionType.TRANSACTIONS_CREATE_SET_OTHER_ACCOUNT,
					ApplicationActionType.TRANSACTIONS_CREATE_CANCEL,
					ApplicationActionType.TRANSACTIONS_CREATE_SUBMIT,

					ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
					ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
					ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
					ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
				]);

				const appState: ApplicationState = yield SE.select(selectAppState);
				if (appState.settings.save === SettingsSaveType.AUTO) {
					const value = JSON.stringify(appState);
					setInLocalStorage(LOCAL_STORAGE_KEY, value);
				}
			} catch (e) {
				console.log('SAVE', e);
			}
		}
	};
};

export const makeLoadAppStateFromLocalStorage = (
	loadFromLocalStorage: (key: string) => string | undefined
) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_LOAD);
				const value = loadFromLocalStorage(LOCAL_STORAGE_KEY);
				if (value !== undefined) {
					const appState: ApplicationState = JSON.parse(value);
					yield SE.put({
						type: ApplicationActionType.ACCOUNTS_SET,
						state: appState.accounts,
					});
					yield SE.put({
						type: ApplicationActionType.TRANSACTIONS_SET,
						state: appState.transactions,
					});
					yield SE.put({
						type: ApplicationActionType.BOOK_ENTRIES_SET,
						state: appState.bookEntries,
					});
					yield SE.put({
						type: ApplicationActionType.SETTINGS_SET,
						state: appState.settings,
					});
				}
			} catch (e) {
				console.log('LOAD', e);
			}
		}
	};
};
