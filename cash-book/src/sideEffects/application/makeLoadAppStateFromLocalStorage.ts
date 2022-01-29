import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';
import { ApplicationState } from '../../applicationState';
import { stateMigrations } from '../../stateMigrations';
import { stateValidation } from '../../stateValidation';

export const makeLoadAppStateFromLocalStorage = (loadFromLocalStorage: (key: string) => string | undefined) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_LOAD);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOADING_SET,
				});

				const value = loadFromLocalStorage(LOCAL_STORAGE_KEY);
				if (value === undefined) {
					yield SE.put({
						type: ApplicationActionType.APPLICATION_DEFAULT_SET,
					});
					continue;
				}
				const appState: ApplicationState = stateMigrations(JSON.parse(value));
				if (stateValidation(appState) === null) {
					yield SE.put({
						type: ApplicationActionType.APPLICATION_DEFAULT_SET,
					});
					continue;
				}

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

				yield SE.put({
					type: ApplicationActionType.APPLICATION_DEFAULT_SET,
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
