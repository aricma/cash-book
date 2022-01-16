import * as SE from 'redux-saga/effects';
import {
	ApplicationActionType,
	BookEntriesExportMonth,
	BookEntriesExportDay,
	AccountsImport,
} from '../applicationState/actions';
import { SettingsSaveType } from '../features/settings/state';
import { ApplicationState, selectAppState } from '../applicationState';
import { LOCAL_STORAGE_KEY } from '../variables/environments';
import { DateWithoutTime } from '../models/domain/date';
import { getFirstDateOfTheMonth, getLastDateOfTheMonth, pad } from '../models/utils';
import hash from 'crypto-js/sha256';
import * as SettingsState from '../features/settings/state';
import * as BookingsState from '../features/bookEntries/state';
import * as AccountsState from '../features/accounts/state';
import * as TransactionsState from '../features/transactions/state';
import { BookEntry } from '../features/bookEntries/state';
import { TransactionType } from '../features/transactions/state';

export const makeSaveAppStateToLocalStorage = (setInLocalStorage: (key: string, value: string) => void) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take([
					ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
					ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
					ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
					ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
					ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,

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
				console.log('SAVE', e);
			}
		}
	};
};

export const makeLoadAppStateFromLocalStorage = (loadFromLocalStorage: (key: string) => string | undefined) => {
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

export const makeReset = (setInLocalStorage: (key: string, value: string) => void) => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_RESET);
				const value = JSON.stringify({
					settings: SettingsState.initialState,
					bookEntries: BookingsState.initialState,
					accounts: AccountsState.initialState,
					transactions: TransactionsState.initialState,
				});
				setInLocalStorage(LOCAL_STORAGE_KEY, value);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
				});
			} catch (_) {}
		}
	};
};

export const makeAccountsImport = () => {
	return function* worker() {
		while (true) {
			try {
				const action: AccountsImport = yield SE.take(ApplicationActionType.ACCOUNTS_IMPORT);
				const appState: ApplicationState = yield SE.select(selectAppState);
				yield SE.put({
					type: ApplicationActionType.ACCOUNTS_SET,
					state: {
						...appState.accounts,
						accounts: {
							...appState.accounts.accounts,
							...action.accounts,
						},
					},
				});
			} catch (_) {}
		}
	};
};

export const makeAccountsExport = () => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.ACCOUNTS_EXPORT);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const headline = ['id', 'name', 'type', 'number'];
				const rows = Object.values(appState.accounts.accounts).map((account): Array<string> => {
					return [account.id, account.name, account.type, account.number];
				});
				const unique = hash(new Date().toISOString());
				const fileName = `accounts-${unique}.csv`;
				exportRowsToCSV([headline, ...rows], fileName);
			} catch (_) {}
		}
	};
};

const headline = [
	'Währung',
	'VorzBetrag',
	'RechNr',
	'BelegDatum',
	'Belegtext',
	'UStSatz',
	'BU',
	'Gegenkonto',
	'Kost1',
	'Kost2',
	'Kostmenge',
	'Skonto',
	'Nachricht',
];

export const makeBookEntriesExportDay = () => {
	return function* worker() {
		while (true) {
			try {
				const action: BookEntriesExportDay = yield SE.take(ApplicationActionType.BOOK_ENTRIES_EXPORT_DAY);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const bookEntry = appState.bookEntries.entries[action.date];
				if (bookEntry !== undefined) {
					const rows = bookEntryToRows(appState, bookEntry);
					const timeOfDownload = new Date().toISOString();
					const date = DateWithoutTime.fromString(action.date);
					const year = date.getFullYear();
					const month = pad(date.getMonth() + 1, 2);
					const day = pad(date.getDate(), 2);
					const unique = hash(timeOfDownload);
					const fileName = `book-entry-${year}-${month}-${day}_${unique}.csv`;
					exportRowsToCSV([headline, ...rows], fileName);
				}
			} catch (_) {}
		}
	};
};

export const makeBookEntriesExportMonth = () => {
	return function* worker() {
		while (true) {
			try {
				const action: BookEntriesExportMonth = yield SE.take(ApplicationActionType.BOOK_ENTRIES_EXPORT_MONTH);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const date = DateWithoutTime.fromString(action.date);
				const fromDate = getFirstDateOfTheMonth(date).getTime();
				const toDate = getLastDateOfTheMonth(date).getTime();
				const bookEntries = Object.values(appState.bookEntries.entries).filter((bookEntry) => {
					const currentDate = DateWithoutTime.fromString(bookEntry.date).getTime();
					return fromDate <= currentDate && currentDate < toDate;
				});
				const rows = bookEntries.reduce((rows: Array<Array<string>>, bookEntry) => {
					return [...rows, ...bookEntryToRows(appState, bookEntry)];
				}, []);
				const timeOfDownload = new Date().toISOString();
				const year = date.getFullYear();
				const month = pad(date.getMonth() + 1, 2);
				const unique = hash(timeOfDownload);
				const fileName = `book-entry-${year}-${month}_${unique}.csv`;
				exportRowsToCSV([headline, ...rows], fileName);
			} catch (_) {}
		}
	};
};

const bookEntryToRows = (appState: ApplicationState, bookEntry: BookEntry): Array<Array<string>> => {
	return appState.transactions.templates[bookEntry.templateId].transactions.map((transactionId) => {
		const value = bookEntry.transactions[transactionId];
		const transaction = appState.transactions.transactions[transactionId];
		const account = appState.accounts.accounts[transaction.accountId];
		return Array(headline.length)
			.fill('')
			.map((placeholder, index) => {
				switch (index) {
					case 0:
						return 'EUR';
					case 1:
						return (transaction.type === TransactionType.IN ? '+' : '-') + value.toString().replace('.', ',');
					case 3: {
						const date = DateWithoutTime.fromString(bookEntry.date);
						const day = date.getDate();
						const month = date.getMonth() + 1;
						return pad(day, 2) + pad(month, 2);
					}
					case 4:
						return transaction.name;
					case 7:
						return account.number;
					default:
						return placeholder;
				}
			});
	});
};

const exportRowsToCSV = (rows: Array<Array<string>>, name?: string) => {
	const csvContent =
		'data:text/csv;charset=utf-8,' +
		rows
			.map((row) => {
				return row.map((cell) => `"${cell}"`).join(';');
			})
			.join('\n');
	const encodedUri = encodeURI(csvContent);

	if (name === undefined) {
		window.open(encodedUri);
	} else {
		// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', name);
		link.setAttribute('class', 'hidden');
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
};
