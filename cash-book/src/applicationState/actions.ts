import { Action } from '../models/reducers';
import { AccountType, AccountsState } from '../features/accounts/state';
import {
	TransactionType,
	TransactionsState,
} from '../features/transactions/state';
import { BookEntriesState } from '../features/bookEntries/state';
import { SettingsState } from '../features/settings/state';

export enum ApplicationActionType {
	APPLICATION_LOAD = 'APPLICATION_ACTION_TYPE/LOAD',
	APPLICATION_SET = 'APPLICATION_ACTION_TYPE/SET',
	APPLICATION_SAVE = 'APPLICATION_ACTION_TYPE/SAVE',

	BROWSER_LOCAL_STORAGE_SET = 'APPLICATION_ACTION_TYPE/BROWSER/LOCAL_STORAGE/SET',
	BROWSER_LOCAL_STORAGE_REMOVE = 'APPLICATION_ACTION_TYPE/BROWSER/LOCAL_STORAGE/REMOVE',

	ROUTER_GO_TO = 'APPLICATION_ACTION_TYPE/ROUTER/GO_TO',

	SETTINGS_SET = 'APPLICATION_ACTION_TYPE/SETTINGS/SET',

	ACCOUNTS_SET = 'APPLICATION_ACTION_TYPE/ACCOUNTS/SET',
	ACCOUNTS_CREATE_SET_TYPE = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/TYPE/SET',
	ACCOUNTS_CREATE_SET_NAME = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/NAME/SET',
	ACCOUNTS_CREATE_SET_NUMBER = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/NUMBER/SET',
	ACCOUNTS_CREATE_CANCEL = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/CANCEL',
	ACCOUNTS_CREATE_SUBMIT = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/SUBMIT',

	TRANSACTIONS_SET = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/SET',
	TRANSACTIONS_ORDER_INC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/ORDER/INCREASE',
	TRANSACTIONS_ORDER_DEC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/ORDER/DECREASE',
	TRANSACTIONS_CREATE_SET_TYPE = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TYPE/SET',
	TRANSACTIONS_CREATE_SET_NAME = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/NAME/SET',
	TRANSACTIONS_CREATE_SET_CASHIER_ACCOUNT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/CASH_STATION/SET',
	TRANSACTIONS_CREATE_SET_OTHER_ACCOUNT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/OTHER_ACCOUNT/SET',
	TRANSACTIONS_CREATE_CANCEL = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/CANCEL',
	TRANSACTIONS_CREATE_SUBMIT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/SUBMIT',

	BOOK_ENTRIES_SET = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/SET',
	BOOK_ENTRIES_EXPORT_DAY = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/EXPORT/DAY',
	BOOK_ENTRIES_EXPORT_MONTH = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/EXPORT/MONTH',
	BOOK_ENTRIES_CREATE_SET_DATE = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/DATE/SET',
	BOOK_ENTRIES_CREATE_SET_TRANSACTION = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/TRANSACTION/SET',
	BOOK_ENTRIES_CREATE_CANCEL = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/CANCEL',
	BOOK_ENTRIES_CREATE_SUBMIT = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/SUBMIT',
}

export type ApplicationAction =
	| Misc
	| BrowserAction
	| RouterAction
	| BookingsAction
	| SettingsAction
	| AccountsAction
	| TransactionsAction;

export type Misc = Load | Set | Save;
export type Load = Action<ApplicationActionType.APPLICATION_LOAD>;
export type Set = Action<ApplicationActionType.APPLICATION_SET, { state: any }>;
export type Save = Action<ApplicationActionType.APPLICATION_SAVE>;

export type BrowserAction = BrowserLocalStorageSet | BrowserLocalStorageRemove;
export type BrowserLocalStorageSet = Action<
	ApplicationActionType.BROWSER_LOCAL_STORAGE_SET,
	{ id: string; value: string }
>;
export type BrowserLocalStorageRemove = Action<
	ApplicationActionType.BROWSER_LOCAL_STORAGE_REMOVE,
	{ id: string }
>;

export type RouterAction = RouterGoTo;
export type RouterGoTo = Action<
	ApplicationActionType.ROUTER_GO_TO,
	{ path: string }
>;

export type SettingsAction = SettingsSet;
export type SettingsSet = Action<
	ApplicationActionType.SETTINGS_SET,
	{ state: SettingsState }
>;

export type AccountsAction =
	| AccountsSet
	| AccountsCreateSetType
	| AccountsCreateSetName
	| AccountsCreteSetNumber
	| AccountsCreateSubmit
	| AccountsCreateCancel;
export type AccountsSet = Action<
	ApplicationActionType.ACCOUNTS_SET,
	{ state: AccountsState }
>;
export type AccountsCreateSetType = Action<
	ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
	{ value: AccountType }
>;
export type AccountsCreateSetName = Action<
	ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
	{ value: string }
>;
export type AccountsCreteSetNumber = Action<
	ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
	{ value: string }
>;
export type AccountsCreateSubmit =
	Action<ApplicationActionType.ACCOUNTS_CREATE_SUBMIT>;
export type AccountsCreateCancel =
	Action<ApplicationActionType.ACCOUNTS_CREATE_CANCEL>;

export type TransactionsAction =
	| TransactionsSet
	| TransactionsOrderInc
	| TransactionsOrderDec
	| TransactionsCreateSetType
	| TransactionsCreateSetName
	| TransactionsCreateSetCashStation
	| TransactionsCreateSetOtherAccount
	| TransactionsCreateSubmit
	| TransactionsCreateCancel;
export type TransactionsSet = Action<
	ApplicationActionType.TRANSACTIONS_SET,
	{ state: TransactionsState }
>;
export type TransactionsOrderInc = Action<
	ApplicationActionType.TRANSACTIONS_ORDER_INC,
	{ transactionId: string }
>;
export type TransactionsOrderDec = Action<
	ApplicationActionType.TRANSACTIONS_ORDER_DEC,
	{ transactionId: string }
>;
export type TransactionsCreateSetType = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_SET_TYPE,
	{ value: TransactionType }
>;
export type TransactionsCreateSetName = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_SET_NAME,
	{ value: string }
>;
export type TransactionsCreateSetCashStation = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_SET_CASHIER_ACCOUNT,
	{ value: string }
>;
export type TransactionsCreateSetOtherAccount = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_SET_OTHER_ACCOUNT,
	{ value: string }
>;
export type TransactionsCreateSubmit =
	Action<ApplicationActionType.TRANSACTIONS_CREATE_SUBMIT>;
export type TransactionsCreateCancel =
	Action<ApplicationActionType.TRANSACTIONS_CREATE_CANCEL>;

export type BookingsAction =
	| BookingsSet
	| BookEntriesExportDay
	| BookEntriesExportMonth
	| BookEntriesCreateSetDate
	| BookEntriesCreateSetTransaction
	| BookEntriesCreateCancel
	| BookEntriesCreateSubmit;
export type BookingsSet = Action<
	ApplicationActionType.BOOK_ENTRIES_SET,
	{ state: BookEntriesState }
>;
export type BookEntriesExportDay = Action<
	ApplicationActionType.BOOK_ENTRIES_EXPORT_DAY,
	{
		date: string;
	}
>;
export type BookEntriesExportMonth = Action<
	ApplicationActionType.BOOK_ENTRIES_EXPORT_MONTH,
	{
		date: string;
	}
>;
export type BookEntriesCreateSetDate = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
	{ date: string }
>;
export type BookEntriesCreateSetTransaction = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
	{ transactionId: string; value: string }
>;
export type BookEntriesCreateCancel =
	Action<ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL>;
export type BookEntriesCreateSubmit =
	Action<ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT>;
