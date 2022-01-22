import * as SE from 'redux-saga/effects';
import {
	ApplicationActionType,
	BookEntriesExportMonth,
	BookEntriesExportDay,
	AccountsImport,
	LoadBackup,
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
import { stateMigrations } from '../stateMigrations';

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
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOADING,
				});
				const value = loadFromLocalStorage(LOCAL_STORAGE_KEY);
				if (value !== undefined) {
					const appState: ApplicationState = stateMigrations(JSON.parse(value));
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
						type: ApplicationActionType.APPLICATION_DEFAULT,
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
				const noUserConsent = !window.confirm(
					'Do you really want to reset your app? Everything will be deleted! This action can not be undone!'
				);
				if (noUserConsent) continue;
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

export const makeBackupWorker = () => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_BACKUP);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const timestamp = new Date().toISOString();
				const fileName = `cash-book-backup-${timestamp}.json`;
				exportToFile(toJSONContent(appState), fileName);
			} catch (_) {}
		}
	};
};

export const makeLoadBackupWorker = (setInLocalStorage: (key: string, value: string) => void) => {
	return function* worker() {
		while (true) {
			try {
				const action: LoadBackup = yield SE.take(ApplicationActionType.APPLICATION_BACKUP_LOAD);
				const text: string = yield SE.call(() => action.file.text());
				const noUserConsent = !window.confirm(
					'Do you really want to load this backup? This action will overwrite your current state of the app! This action can not be undone!'
				);
				if (noUserConsent) continue;
				setInLocalStorage(LOCAL_STORAGE_KEY, text);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
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
				exportToFile(toCSVContent([headline, ...rows]), fileName);
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
				const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
				if (selectedTemplatesId === undefined) continue;
				const bookEntry = appState.bookEntries.templates[selectedTemplatesId][action.date];
				if (bookEntry !== undefined) {
					const rows = bookEntryToRows(appState, bookEntry);
					const timeOfDownload = new Date().toISOString();
					const date = DateWithoutTime.fromString(action.date);
					const year = date.getFullYear();
					const month = pad(date.getMonth() + 1, 2);
					const day = pad(date.getDate(), 2);
					const unique = hash(timeOfDownload);
					const fileName = `book-entry-${year}-${month}-${day}_${unique}.csv`;
					exportToFile(toCSVContent([headline, ...rows]), fileName);
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
				const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
				if (selectedTemplatesId === undefined) continue;
				const bookEntries = Object.values(appState.bookEntries.templates[selectedTemplatesId]).filter((bookEntry) => {
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
				exportToFile(toCSVContent([headline, ...rows]), fileName);
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

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
const exportToFile = (content: string, name?: string) => {
	const encodedUri = encodeURI(content);

	if (name === undefined) {
		window.open(encodedUri);
	} else {
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', name);
		link.setAttribute('class', 'hidden');
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
};

const toCSVContent = (rows: Array<Array<string>>): string => {
	return (
		'data:text/csv;charset=utf-8,' +
		rows
			.map((row) => {
				return row.map((cell) => `"${cell}"`).join(';');
			})
			.join('\n')
	);
};

const toJSONContent = (object: any) => {
	return 'data:text/json;charset=utf-8,' + JSON.stringify(object);
};

// const importFromFile = (): Promise<File | null> => {
// 	const input: HTMLInputElement = document.createElement('input');
// 	return new Promise<File | null>((resolve) => {
// 		input.setAttribute('class', 'hidden');
// 		input.setAttribute('type', "file");
// 		input.setAttribute('value', "");
// 		input.addEventListener('input', (e: InputEvent) => {
// 			e.target.files
//
// 		});
// 		input.onchange = (globalEvent:InputEvent, event: ChangeEvent<HTMLInputElement>) => {
// 			if (event.target.files === null) resolve(null);
// 			const file: File = globalEvent.files[0];
// 			resolve(file);
// 			input.remove();
// 		};
// 		document.body.appendChild(input);
// 		input.click();
// 	}).finally(() => {
// 		input.remove();
// 	});
// }
