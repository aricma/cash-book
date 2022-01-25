import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { SettingsSaveType } from '../../features/settings/state';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeSaveAppStateToLocalStorage = (setInLocalStorage: (key: string, value: string) => void) => {
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
					const value = JSON.stringify(appState);
					setInLocalStorage(LOCAL_STORAGE_KEY, value);
				}
			} catch (e) {
				// eslint-disable-next-line
				console.log(e);
			}
		}
	};
};
