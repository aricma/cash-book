import * as SE from 'redux-saga/effects';
import * as AccountsState from '../../features/accounts/state';
import * as TransactionsState from '../../features/transactions/state';
import * as BookEntriesState from '../../features/bookEntries/state';
import { ApplicationActionType } from '../../applicationState/actions';
import { backupValidation } from '../../backupValidation';
import { migrateBackup } from '../../backupMigrations';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeLoadAppStateFromLocalStorage = (loadFromLocalStorage: (key: string) => string | undefined) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_LOAD);
				yield SE.put({ type: ApplicationActionType.APPLICATION_LOADING_SET });

				const value = loadFromLocalStorage(LOCAL_STORAGE_KEY);
				if (value === undefined) {
					yield SE.put({ type: ApplicationActionType.APPLICATION_DEFAULT_SET });
					continue;
				}
				const backup = JSON.parse(value);
				const migratedBackup = migrateBackup(backup);
				const backupIsNotValid = backupValidation(migratedBackup) !== null;
				if (backupIsNotValid) {
					yield SE.put({ type: ApplicationActionType.APPLICATION_DEFAULT_SET });
					continue;
				}

				yield SE.put({
					type: ApplicationActionType.ACCOUNTS_SET,
					state: {
						...AccountsState.initialState,
						accounts: migratedBackup.accounts,
					},
				});
				yield SE.put({
					type: ApplicationActionType.TRANSACTIONS_SET,
					state: {
						...TransactionsState.initialState,
						templates: migratedBackup.templates,
						transactions: migratedBackup.transactions,
					},
				});
				yield SE.put({
					type: ApplicationActionType.BOOK_ENTRIES_SET,
					state: {
						...BookEntriesState.initialState,
						templates: migratedBackup.bookEntries,
					},
				});

				yield SE.put({ type: ApplicationActionType.APPLICATION_DEFAULT_SET });
			} catch (error) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: error,
				});
			}
		}
	};
};
