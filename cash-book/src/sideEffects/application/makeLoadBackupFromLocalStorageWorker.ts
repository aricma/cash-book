import * as SE from 'redux-saga/effects';
import * as TransactionsState from '../../features/transactions/state';
import { ApplicationActionType, AccountsSet, BookEntriesSet, TransactionsSet } from '../../applicationState/actions';
import { Validation } from '../../backupValidation/makeBackupValidation';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const INVALID_BACKUP_ERROR = 'Load Backup: given backup in local storage is in ';

interface Request {
	getFromLocalStorage: (key: string) => string | undefined;
	parseJSON: <T>(value: string) => T;
	migrateBackup: <T, U = any>(value: T) => U;
	backupValidation: Validation;
}
export const makeLoadBackupFromLocalStorageWorker = (request: Request) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_LOAD);
				yield SE.put({ type: ApplicationActionType.APPLICATION_LOADING_SET });
				const value = request.getFromLocalStorage(LOCAL_STORAGE_KEY);
				if (value === undefined) {
					yield SE.put({ type: ApplicationActionType.APPLICATION_DEFAULT_SET });
					continue;
				}

				const backup = request.parseJSON(value);
				const migratedBackup = request.migrateBackup(backup);
				const backupIsNotValid = request.backupValidation(migratedBackup) !== null;
				if (backupIsNotValid) {
					yield SE.put({
						type: ApplicationActionType.APPLICATION_ERROR_SET,
						error: Error(INVALID_BACKUP_ERROR),
					});
					continue;
				}

				yield SE.put<AccountsSet>({
					type: ApplicationActionType.ACCOUNTS_SET,
					accounts: migratedBackup.accounts,
				});
				yield SE.put<TransactionsSet>({
					type: ApplicationActionType.TRANSACTIONS_SET,
					state: {
						...TransactionsState.initialState,
						templates: migratedBackup.templates,
						transactions: migratedBackup.transactions,
					},
				});
				yield SE.put<BookEntriesSet>({
					type: ApplicationActionType.BOOK_ENTRIES_SET,
					bookEntries: migratedBackup.bookEntries,
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
