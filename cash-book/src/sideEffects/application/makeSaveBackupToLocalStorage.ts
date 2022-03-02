import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { SettingsSaveType } from '../../features/settings/state';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';
import { ApplicationState, selectAppState } from '../../applicationState';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

export const makeSaveBackupToLocalStorage = (
	setInLocalStorage: (key: string, value: string) => void,
	toBackup: (appState: any) => any
) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take([
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
				]);
				const appState: ApplicationState = yield SE.select(selectAppState);
				if (appState.settings.save === SettingsSaveType.AUTO) {
					const backup = toBackup(appState);
					const value = JSON.stringify(backup);
					setInLocalStorage(LOCAL_STORAGE_KEY, value);
				}
			} catch (error: any) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: new CashBookError(CashBookErrorType.FAILED_TO_SAVE_BACKUP_TO_LOCAL_STORAGE, error),
				});
			}
		}
	};
};
