import { Action } from '../models/reducers';
import { AccountType, Account } from '../features/accounts/state';
import { TransactionType, TransactionsState } from '../features/transactions/state';
import { Templates, Create } from '../features/bookEntries/state';
import { SettingsState } from '../features/settings/state';

export enum ApplicationActionType {
	APPLICATION_DEFAULT_SET = 'APPLICATION_ACTION_TYPE/DEFAULT/SET',
	APPLICATION_LOADING_SET = 'APPLICATION_ACTION_TYPE/LOADING/SET',
	APPLICATION_ERROR_SET = 'APPLICATION_ACTION_TYPE/ERROR/SET',
	APPLICATION_BACKUP_LOAD = 'APPLICATION_ACTION_TYPE/BACKUP/LOAD',
	APPLICATION_LOAD = 'APPLICATION_ACTION_TYPE/LOAD',
	APPLICATION_SET = 'APPLICATION_ACTION_TYPE/SET',
	APPLICATION_SAVE = 'APPLICATION_ACTION_TYPE/SAVE',
	APPLICATION_RESET = 'APPLICATION_ACTION_TYPE/RESET',
	APPLICATION_EXPORT = 'APPLICATION_ACTION_TYPE/EXPORT',

	BROWSER_LOCAL_STORAGE_SET = 'APPLICATION_ACTION_TYPE/BROWSER/LOCAL_STORAGE/SET',
	BROWSER_LOCAL_STORAGE_REMOVE = 'APPLICATION_ACTION_TYPE/BROWSER/LOCAL_STORAGE/REMOVE',

	ROUTER_GO_TO = 'APPLICATION_ACTION_TYPE/ROUTER/GO_TO',
	ROUTER_FALLBACK = 'APPLICATION_ACTION_TYPE/ROUTER/FALLBACK',

	SETTINGS_SET = 'APPLICATION_ACTION_TYPE/SETTINGS/SET',
	SETTINGS_RESET = 'APPLICATION_ACTION_TYPE/SETTINGS/RESET',

	ACCOUNTS_SET = 'APPLICATION_ACTION_TYPE/ACCOUNTS/SET',
	ACCOUNTS_RESET = 'APPLICATION_ACTION_TYPE/ACCOUNTS/RESET',
	ACCOUNTS_EDIT = 'APPLICATION_ACTION_TYPE/ACCOUNTS/EDIT',
	ACCOUNTS_REMOVE = 'APPLICATION_ACTION_TYPE/ACCOUNTS/REMOVE',
	ACCOUNTS_CREATE_SET_TYPE = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/TYPE/SET',
	ACCOUNTS_CREATE_SET_NAME = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/NAME/SET',
	ACCOUNTS_CREATE_SET_NUMBER = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/NUMBER/SET',
	ACCOUNTS_CREATE_CANCEL = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/CANCEL',
	ACCOUNTS_CREATE_SUBMIT = 'APPLICATION_ACTION_TYPE/ACCOUNTS/CREATE/SUBMIT',

	TRANSACTIONS_SET = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/SET',
	TRANSACTIONS_RESET = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/RESET',
	TRANSACTIONS_EDIT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/EDIT',
	TRANSACTIONS_MOVE = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/ORDER/MOVE',
	TRANSACTIONS_ORDER_INC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/ORDER/INCREASE',
	TRANSACTIONS_ORDER_DEC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/ORDER/DECREASE',
	TRANSACTIONS_CREATE_ORDER_INC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/ORDER/INCREASE',
	TRANSACTIONS_CREATE_ORDER_DEC = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/ORDER/DECREASE',
	TRANSACTIONS_CREATE_TEMPLATE_SET_NAME = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TEMPLATE/NAME/SET',
	TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TEMPLATE/CASHIER_ACCOUNT/SET',
	TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TEMPLATE/DIFF_ACCOUNT/SET',
	TRANSACTIONS_CREATE_TRANSACTION_ADD = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TRANSACTION/ADD',
	TRANSACTIONS_CREATE_TRANSACTION_REMOVE = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TRANSACTION/REMOVE',
	TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TRANSACTION/TYPE/SET',
	TRANSACTIONS_CREATE_TRANSACTION_SET_NAME = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TRANSACTION/NAME/SET',
	TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TRANSACTION/ACCOUNT/SET',
	TRANSACTIONS_CREATE_TEMPLATE_CANCEL = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TEMPLATE/CANCEL',
	TRANSACTIONS_CREATE_TEMPLATE_SUBMIT = 'APPLICATION_ACTION_TYPE/TRANSACTIONS/CREATE/TEMPLATE/SUBMIT',

	BOOK_ENTRIES_SET = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/SET',
	BOOK_ENTRIES_RESET = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/RESET',
	BOOK_ENTRIES_EDIT = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/EDIT',
	BOOK_ENTRIES_EDIT_SET = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/EDIT/SET',
	BOOK_ENTRIES_SET_TEMPLATE = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/TEMPLATE/SET',
	BOOK_ENTRIES_CREATE_SET_TEMPLATE = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/TEMPLATE/SET',
	BOOK_ENTRIES_CREATE_SET_CASH_START = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/CASH/START',
	BOOK_ENTRIES_CREATE_SET_CASH_END = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/CASH/END',
	BOOK_ENTRIES_CREATE_SET_DATE = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/DATE/SET',
	BOOK_ENTRIES_CREATE_SET_TRANSACTION = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/TRANSACTION/SET',
	BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/DIFFERENCE/ADD',
	BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/DIFFERENCE/REMOVE',
	BOOK_ENTRIES_CREATE_CANCEL = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/CANCEL',
	BOOK_ENTRIES_CREATE_SUBMIT = 'APPLICATION_ACTION_TYPE/BOOK_ENTRIES/CREATE/SUBMIT',
}

export type ApplicationAction =
	| Misc
	| LoadingSet
	| DefaultSet
	| BrowserAction
	| RouterAction
	| BookEntriesAction
	| SettingsAction
	| AccountsAction
	| TransactionsAction;

export type Misc = LoadBackup | Load | Set | Save | Reset | DefaultSet | LoadingSet | ErrorSet | Export;
export type DefaultSet = Action<ApplicationActionType.APPLICATION_DEFAULT_SET>;
export type LoadingSet = Action<ApplicationActionType.APPLICATION_LOADING_SET>;
export type ErrorSet = Action<ApplicationActionType.APPLICATION_ERROR_SET, { error: Error }>;
export type LoadBackup = Action<ApplicationActionType.APPLICATION_BACKUP_LOAD, { file: File }>;
export type Load = Action<ApplicationActionType.APPLICATION_LOAD>;
export type Set = Action<ApplicationActionType.APPLICATION_SET, { state: any }>;
export type Save = Action<ApplicationActionType.APPLICATION_SAVE>;
export type Reset = Action<ApplicationActionType.APPLICATION_RESET>;
export type Export = Action<ApplicationActionType.APPLICATION_EXPORT, { payload: ExportPayload }>;
export type ExportPayload = ExportAll | ExportBookEntries | ExportAccounts | ExportTransactions;

export enum ExportPayloadType {
	ACCOUNTS = 'EXPORT_PAYLOAD_TYPE/ACCOUNTS',
	TRANSACTIONS = 'EXPORT_PAYLOAD_TYPE/TRANSACTIONS',
	BOOK_ENTRIES = 'EXPORT_PAYLOAD_TYPE/BOOK_ENTRIES',
	ALL = 'EXPORT_PAYLOAD_TYPE/ALL',
}

export enum ExportFileType {
	CSV = 'EXPORT_FILE_TYPE/CSV',
	JSON = 'EXPORT_FILE_TYPE/JSON',
	DATEV_CSV = 'EXPORT_FILE_TYPE/DATEV_CSV',
}

export interface ExportAccounts {
	type: ExportPayloadType.ACCOUNTS;
	fileType: ExportFileType;
}

export interface ExportTransactions {
	type: ExportPayloadType.TRANSACTIONS;
	fileType: ExportFileType.JSON;
}

export interface ExportBookEntries {
	type: ExportPayloadType.BOOK_ENTRIES;
	fileType: ExportFileType;
	range: 'day' | 'month';
	date: string;
}

export interface ExportAll {
	type: ExportPayloadType.ALL;
	fileType: ExportFileType;
}

export type BrowserAction = BrowserLocalStorageSet | BrowserLocalStorageRemove;
export type BrowserLocalStorageSet = Action<
	ApplicationActionType.BROWSER_LOCAL_STORAGE_SET,
	{ id: string; value: string }
>;
export type BrowserLocalStorageRemove = Action<ApplicationActionType.BROWSER_LOCAL_STORAGE_REMOVE, { id: string }>;

export type RouterAction = RouterGoTo | RouterFallback;
export type RouterGoTo = Action<ApplicationActionType.ROUTER_GO_TO, { path: string }>;
export type RouterFallback = Action<ApplicationActionType.ROUTER_FALLBACK>;

export type SettingsAction = SettingsSet | SettingsReset;
export type SettingsSet = Action<ApplicationActionType.SETTINGS_SET, { state: SettingsState }>;
export type SettingsReset = Action<ApplicationActionType.SETTINGS_RESET>;

export type AccountsAction =
	| AccountsSet
	| AccountsReset
	| AccountsEdit
	| AccountsRemove
	| AccountsCreateSetType
	| AccountsCreateSetName
	| AccountsCreateSetNumber
	| AccountsCreateSubmit
	| AccountsCreateCancel;
export type AccountsSet = Action<ApplicationActionType.ACCOUNTS_SET, { accounts: { [accountId: string]: Account } }>;
export type AccountsReset = Action<ApplicationActionType.ACCOUNTS_RESET>;
export type AccountsEdit = Action<ApplicationActionType.ACCOUNTS_EDIT, { accountId: string }>;
export type AccountsRemove = Action<ApplicationActionType.ACCOUNTS_REMOVE, { accountId: string }>;
export type AccountsCreateSetType = Action<ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE, { value: AccountType }>;
export type AccountsCreateSetName = Action<ApplicationActionType.ACCOUNTS_CREATE_SET_NAME, { value: string }>;
export type AccountsCreateSetNumber = Action<ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER, { value: string }>;
export type AccountsCreateSubmit = Action<ApplicationActionType.ACCOUNTS_CREATE_SUBMIT>;
export type AccountsCreateCancel = Action<ApplicationActionType.ACCOUNTS_CREATE_CANCEL>;

export type TransactionsAction =
	| TransactionsSet
	| TransactionsReset
	| TransactionsEdit
	| TransactionsMove
	| TransactionsOrderInc
	| TransactionsOrderDec
	| TransactionsCreateOrderInc
	| TransactionsCreateOrderDec
	| TransactionsCreateTransactionSetName
	| TransactionsCreateSetCashierAccount
	| TransactionsCreateTemplateSetDiffAccount
	| TransactionsCreateTransactionAdd
	| TransactionsCreateTransactionRemove
	| TransactionsCreateTemplateSetName
	| TransactionsCreateTransactionSetType
	| TransactionsCreateTransactionSetAccount
	| TransactionsCreateSubmit
	| TransactionsCreateTemplateCancel;
export type TransactionsSet = Action<ApplicationActionType.TRANSACTIONS_SET, { state: TransactionsState }>;
export type TransactionsReset = Action<ApplicationActionType.TRANSACTIONS_RESET>;
export type TransactionsEdit = Action<ApplicationActionType.TRANSACTIONS_EDIT, { templateId: string }>;
export type TransactionsMove = Action<
	ApplicationActionType.TRANSACTIONS_MOVE,
	{
		templateId: string;
		fromIndex: number;
		toIndex: number;
	}
>;
export type TransactionsOrderInc = Action<
	ApplicationActionType.TRANSACTIONS_ORDER_INC,
	{ templateId: string; transactionId: string }
>;
export type TransactionsOrderDec = Action<
	ApplicationActionType.TRANSACTIONS_ORDER_DEC,
	{ templateId: string; transactionId: string }
>;
export type TransactionsCreateOrderInc = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC,
	{ transactionId: string }
>;
export type TransactionsCreateOrderDec = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC,
	{ transactionId: string }
>;
export type TransactionsCreateTemplateSetName = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME,
	{ name: string }
>;
export type TransactionsCreateTemplateSetDiffAccount = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT,
	{ diffAccountId: string }
>;
export type TransactionsCreateSetCashierAccount = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT,
	{ cashierAccountId: string }
>;
export type TransactionsCreateTransactionAdd = Action<ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD>;
export type TransactionsCreateTransactionRemove = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
	{ transactionId: string }
>;
export type TransactionsCreateTransactionSetType = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE,
	{ transactionId: string; transactionType: TransactionType }
>;
export type TransactionsCreateTransactionSetName = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME,
	{ transactionId: string; name: string }
>;
export type TransactionsCreateTransactionSetAccount = Action<
	ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT,
	{ transactionId: string; accountId: string }
>;
export type TransactionsCreateSubmit = Action<ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT>;
export type TransactionsCreateTemplateCancel = Action<ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL>;

export type BookEntriesAction =
	| BookEntriesSet
	| BookEntriesReset
	| BookEntriesEdit
	| BookEntriesEditSet
	| BookEntriesSetTemplate
	| BookEntriesCreateSetTemplate
	| BookEntriesCreateSetCashStart
	| BookEntriesCreateSetCashEnd
	| BookEntriesCreateSetDate
	| BookEntriesCreateSetTransaction
	| BookEntriesCreateAddDiffTransaction
	| BookEntriesCreateRemoveDiffTransaction
	| BookEntriesCreateCancel
	| BookEntriesCreateSubmit;
export type BookEntriesSet = Action<ApplicationActionType.BOOK_ENTRIES_SET, { bookEntries: Templates }>;
export type BookEntriesReset = Action<ApplicationActionType.BOOK_ENTRIES_RESET>;
export type BookEntriesEdit = Action<ApplicationActionType.BOOK_ENTRIES_EDIT, { templateId: string; date: string }>;
export type BookEntriesEditSet = Action<ApplicationActionType.BOOK_ENTRIES_EDIT_SET, { state: Create }>;
export type BookEntriesSetTemplate = Action<ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE, { templateId: string }>;
export type BookEntriesCreateSetTemplate = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
	{
		templateId: string;
	}
>;
export type BookEntriesCreateSetCashStart = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
	{
		templateId: string;
		value: string;
	}
>;
export type BookEntriesCreateSetCashEnd = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
	{
		templateId: string;
		value: string;
	}
>;
export type BookEntriesCreateSetDate = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
	{ templateId: string; date: string }
>;
export type BookEntriesCreateSetTransaction = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
	{ templateId: string; transactionId: string; value: string }
>;
export type BookEntriesCreateAddDiffTransaction = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION,
	{
		templateId: string;
		transactionId: string;
		value: string;
	}
>;
export type BookEntriesCreateRemoveDiffTransaction = Action<
	ApplicationActionType.BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION,
	{ templateId: string }
>;
export type BookEntriesCreateCancel = Action<ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL, { templateId: string }>;
export type BookEntriesCreateSubmit = Action<ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT, { templateId: string }>;
