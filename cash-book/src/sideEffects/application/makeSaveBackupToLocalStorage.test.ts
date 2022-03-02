import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { SettingsSaveType } from '../../features/settings/state';
import { makeSaveBackupToLocalStorage } from './makeSaveBackupToLocalStorage';
import { expectSaga } from 'redux-saga-test-plan';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';
import { selectAppState } from '../../applicationState';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

describe(makeSaveBackupToLocalStorage.name, () => {
	const actions = [
		ApplicationActionType.ACCOUNTS_EDIT,
		ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
		ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
		ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
		ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
		ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,

		ApplicationActionType.TRANSACTIONS_EDIT,
		ApplicationActionType.TRANSACTIONS_MOVE,
		ApplicationActionType.TRANSACTIONS_ORDER_INC,
		ApplicationActionType.TRANSACTIONS_ORDER_DEC,
		ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC,
		ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC,
		ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME,
		ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT,
		ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT,
		ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
		ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
		ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE,
		ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME,
		ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT,
		ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL,
		ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT,

		ApplicationActionType.BOOK_ENTRIES_EDIT,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
		ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
		ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
	];

	describe(SettingsSaveType.AUTO, () => {
		actions.forEach((type) => {
			test('when called with action, then saves appState as backup in local storage', async () => {
				const appState = {
					settings: {
						save: SettingsSaveType.AUTO,
					},
				};
				const setInLocalStorage = jest.fn();
				const toBackup = jest.fn(() => ({
					__version__: 'v0.0.0',
				}));
				const worker = makeSaveBackupToLocalStorage(setInLocalStorage, toBackup);
				await expectSaga(worker)
					.provide([[SE.select(selectAppState), appState]])
					.dispatch({ type })
					.run({ silenceTimeout: true, timeout: 250 });
				expect(toBackup).toBeCalledWith(appState);
				expect(setInLocalStorage).toBeCalledWith(LOCAL_STORAGE_KEY, '{"__version__":"v0.0.0"}');
			});
		});
	});

	describe(SettingsSaveType.MANUAL, () => {
		actions.forEach((type) => {
			test('when called with action, then does nothing', async () => {
				const appState = {
					settings: {
						save: SettingsSaveType.MANUAL,
					},
				};
				const setInLocalStorage = jest.fn();
				const toBackup = jest.fn();
				const worker = makeSaveBackupToLocalStorage(setInLocalStorage, toBackup);
				await expectSaga(worker)
					.provide([[SE.select(selectAppState), appState]])
					.dispatch({ type })
					.run({ silenceTimeout: true, timeout: 250 });
				expect(toBackup).not.toBeCalled();
				expect(setInLocalStorage).not.toBeCalled();
			});
		});
	});

	test('given toBackup fails, when called, then puts expected action', async () => {
		const appState = {
			settings: {
				save: SettingsSaveType.AUTO,
			},
		};
		const toBackup = () => {
			throw Error('ANY');
		};
		return expectSaga(makeSaveBackupToLocalStorage(() => {}, toBackup))
			.dispatch({ type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT })
			.provide([[SE.select(selectAppState), appState]])
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: new CashBookError(CashBookErrorType.FAILED_TO_SAVE_BACKUP_TO_LOCAL_STORAGE, Error('ANY')),
			})
			.run({ silenceTimeout: true, timeout: 250 });
	});
});
