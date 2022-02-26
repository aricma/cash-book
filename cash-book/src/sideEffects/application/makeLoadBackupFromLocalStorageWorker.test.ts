import * as TransactionsState from '../../features/transactions/state';
import { ApplicationActionType, BookEntriesSet, TransactionsSet, AccountsSet } from '../../applicationState/actions';
import { AccountType } from '../../features/accounts/state';
import { TransactionType } from '../../features/transactions/state';
import { LatestVersion, latestVersion } from '../../backupMigrations';
import { expectSaga } from 'redux-saga-test-plan';
import { makeLoadBackupFromLocalStorageWorker, INVALID_BACKUP_ERROR } from './makeLoadBackupFromLocalStorageWorker';

const getFromLocalStorage = jest.fn();
const parseJSON = jest.fn();
const migrateBackup = jest.fn();
const backupValidation = jest.fn();

beforeEach(() => {
	getFromLocalStorage.mockReset();
	parseJSON.mockReset();
	migrateBackup.mockReset();
	backupValidation.mockReset();
});

describe(makeLoadBackupFromLocalStorageWorker.name, () => {
	const loadBackupFromLocalStorageWorker = makeLoadBackupFromLocalStorageWorker({
		getFromLocalStorage: getFromLocalStorage,
		parseJSON: parseJSON,
		migrateBackup: migrateBackup,
		backupValidation: backupValidation,
	});

	test('given no data in local storage, when called, then continues', async () => {
		getFromLocalStorage.mockReturnValue(undefined);
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_DEFAULT_SET,
			})
			.run({ silenceTimeout: true });
	});

	test('given un-parsable json in local storage, when called, then sets error in state', async () => {
		getFromLocalStorage.mockReturnValue('invalid json');
		parseJSON.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});

	test('given migration fails, when called, then sets error in state', async () => {
		getFromLocalStorage.mockReturnValue('{}');
		parseJSON.mockReturnValue({});
		migrateBackup.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});

	test('given validation fails, when called, then sets error in state', async () => {
		getFromLocalStorage.mockReturnValue('{}');
		parseJSON.mockReturnValue({});
		migrateBackup.mockReturnValue({});
		backupValidation.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});

	test('given backup is not valid, when called, then continues', async () => {
		getFromLocalStorage.mockReturnValue('{}');
		parseJSON.mockReturnValue({});
		migrateBackup.mockReturnValue({});
		backupValidation.mockReturnValue({});
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error(INVALID_BACKUP_ERROR),
			})
			.run({ silenceTimeout: true });
	});

	test('given backup is valid, when called, then sets all states from backup', async () => {
		getFromLocalStorage.mockReturnValue('{}');
		parseJSON.mockReturnValue({});
		migrateBackup.mockImplementation(
			(): LatestVersion => ({
				__version__: latestVersion,
				accounts: {
					A: {
						id: 'A',
						type: AccountType.DEFAULT,
						name: 'Acc A',
						number: '1000',
					},
					B: {
						id: 'B',
						type: AccountType.DIFFERENCE,
						name: 'Acc B',
						number: '2000',
					},
					C: {
						id: 'C',
						type: AccountType.CASH_STATION,
						name: 'Acc C',
						number: '3000',
					},
				},
				templates: {
					T1: {
						id: 'T1',
						name: 'Temp 1',
						diffAccountId: 'B',
						cashierAccountId: 'C',
						transactionIds: [],
						autoDiffInId: 'SYS_IN',
						autoDiffOutId: 'SYS_OUT',
					},
				},
				transactions: {
					TA: {
						id: 'TA',
						type: TransactionType.IN,
						name: 'In',
						accountId: 'A',
					},
					TB: {
						id: 'TB',
						type: TransactionType.OUT,
						name: 'In',
						accountId: 'A',
					},
					SYS_IN: {
						id: 'SYS_IN',
						type: TransactionType.SYS_IN,
						name: 'Sys In',
						accountId: 'B',
					},
					SYS_OUT: {
						id: 'SYS_OUT',
						type: TransactionType.SYS_OUT,
						name: 'Sys Out',
						accountId: 'B',
					},
				},
				bookEntries: {
					T1: {
						'2000-1-1': {
							templateId: 'T1',
							date: '2000-1-1',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								TA: '100.00',
								TB: '120.00',
								SYS_IN: '20.00',
							},
						},
					},
				},
			})
		);
		backupValidation.mockReturnValue(null);
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			})
			.put<AccountsSet>({
				type: ApplicationActionType.ACCOUNTS_SET,
				accounts: {
					A: {
						id: 'A',
						type: AccountType.DEFAULT,
						name: 'Acc A',
						number: '1000',
					},
					B: {
						id: 'B',
						type: AccountType.DIFFERENCE,
						name: 'Acc B',
						number: '2000',
					},
					C: {
						id: 'C',
						type: AccountType.CASH_STATION,
						name: 'Acc C',
						number: '3000',
					},
				},
			})
			.put<TransactionsSet>({
				type: ApplicationActionType.TRANSACTIONS_SET,
				state: {
					...TransactionsState.initialState,
					templates: {
						T1: {
							id: 'T1',
							name: 'Temp 1',
							diffAccountId: 'B',
							cashierAccountId: 'C',
							transactionIds: [],
							autoDiffInId: 'SYS_IN',
							autoDiffOutId: 'SYS_OUT',
						},
					},
					transactions: {
						TA: {
							id: 'TA',
							type: TransactionType.IN,
							name: 'In',
							accountId: 'A',
						},
						TB: {
							id: 'TB',
							type: TransactionType.OUT,
							name: 'In',
							accountId: 'A',
						},
						SYS_IN: {
							id: 'SYS_IN',
							type: TransactionType.SYS_IN,
							name: 'Sys In',
							accountId: 'B',
						},
						SYS_OUT: {
							id: 'SYS_OUT',
							type: TransactionType.SYS_OUT,
							name: 'Sys Out',
							accountId: 'B',
						},
					},
				},
			})
			.put<BookEntriesSet>({
				type: ApplicationActionType.BOOK_ENTRIES_SET,
				bookEntries: {
					T1: {
						'2000-1-1': {
							templateId: 'T1',
							date: '2000-1-1',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								TA: '100.00',
								TB: '120.00',
								SYS_IN: '20.00',
							},
						},
					},
				},
			})
			.put({
				type: ApplicationActionType.APPLICATION_DEFAULT_SET,
			})
			.run({ silenceTimeout: true });
	});

	test('given some error, when called, then sets application error in state', async () => {
		getFromLocalStorage.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(loadBackupFromLocalStorageWorker)
			.dispatch({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});
});
