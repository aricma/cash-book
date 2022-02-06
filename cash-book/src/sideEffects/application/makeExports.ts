import * as SE from 'redux-saga/effects';
import { ApplicationActionType, Export } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import hash from 'crypto-js/sha256';
import { toCSVContent, toJSONContent, toDateString } from './utils';
import { Channel } from 'redux-saga';
import { ExportFileConfig } from './makeExportToFile';
import { compactObject, getFirstDateOfTheMonth, getLastDateOfTheMonth, pad } from '../../models/utils';
import { bookEntryToDatevRows, headline } from './datev';
import { DateWithoutTime } from '../../models/domain/date';
import { latestVersion } from '../../backupMigrations';

export const makeExports = (exportFilesQueue: Channel<ExportFileConfig>) => {
	return function* worker() {
		while (true) {
			try {
				const action: Export = yield SE.take(ApplicationActionType.APPLICATION_EXPORT);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const timeOfDownload = new Date().toISOString();
				const unique = hash(timeOfDownload);
				switch (action.exportPayloadType) {
					case 'EXPORT_PAYLOAD_TYPE/ACCOUNTS':
						switch (action.fileType) {
							case 'csv':
								const headline = ['id', 'name', 'type', 'number'];
								const rows = Object.values(appState.accounts.accounts).map((account): Array<string> => {
									return [account.id, account.name, account.type, account.number];
								});
								exportFilesQueue.put({
									name: `accounts-${unique}.csv`,
									content: toCSVContent([headline, ...rows]),
								});
								break;
							case 'json':
								exportFilesQueue.put({
									name: `accounts-${unique}.csv`,
									content: toJSONContent(appState.accounts.accounts),
								});
								break;
						}
						break;
					case 'EXPORT_PAYLOAD_TYPE/TRANSACTIONS':
						exportFilesQueue.put({
							name: `transactions-${unique}.csv`,
							content: toJSONContent(
								compactObject({
									...appState.transactions,
									create: undefined,
								})
							),
						});
						break;
					case 'EXPORT_PAYLOAD_TYPE/BOOK_ENTRIES':
						switch (action.fileType + '-' + action.range) {
							case 'datev-day': {
								const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
								if (selectedTemplatesId === undefined) break;
								const bookEntry = appState.bookEntries.templates[selectedTemplatesId][action.date];
								if (bookEntry === undefined) break;
								const rows = bookEntryToDatevRows(appState, bookEntry);
								const cashierName = appState.transactions.templates[selectedTemplatesId].name;
								const fileName = `book-entry-${cashierName}-${toDateString(action.date)}-${unique}.csv`;
								exportFilesQueue.put({
									name: fileName,
									content: toCSVContent([headline, ...rows]),
								});
								break;
							}
							case 'datev-month': {
								const date = DateWithoutTime.fromString(action.date);
								const fromDate = getFirstDateOfTheMonth(date).getTime();
								const toDate = getLastDateOfTheMonth(date).getTime();
								const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
								if (selectedTemplatesId === undefined) break;
								const bookEntries = Object.values(appState.bookEntries.templates[selectedTemplatesId]).filter(
									(bookEntry) => {
										const currentDate = DateWithoutTime.fromString(bookEntry.date).getTime();
										return fromDate <= currentDate && currentDate < toDate;
									}
								);
								const rows = bookEntries.reduce((rows: Array<Array<string>>, bookEntry) => {
									return [...rows, ...bookEntryToDatevRows(appState, bookEntry)];
								}, []);
								const cashierName = appState.transactions.templates[selectedTemplatesId].name.toLowerCase();
								const year = date.getFullYear();
								const month = pad(date.getMonth() + 1, 2);
								const fileName = `book-entries-${cashierName}-${year}-${month}_${unique}.csv`;
								exportFilesQueue.put({
									name: fileName,
									content: toCSVContent([headline, ...rows]),
								});
								break;
							}
							case 'json-day': {
								const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
								if (selectedTemplatesId === undefined) break;
								const bookEntry = appState.bookEntries.templates[selectedTemplatesId][action.date];
								if (bookEntry === undefined) break;
								const fileName = `book-entry-${toDateString(action.date)}-${unique}.csv`;
								exportFilesQueue.put({
									name: fileName,
									content: toJSONContent(bookEntry),
								});
								break;
							}
							case 'json-month': {
								const date = DateWithoutTime.fromString(action.date);
								const fromDate = getFirstDateOfTheMonth(date).getTime();
								const toDate = getLastDateOfTheMonth(date).getTime();
								const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
								if (selectedTemplatesId === undefined) break;
								const bookEntries = Object.values(appState.bookEntries.templates[selectedTemplatesId]).filter(
									(bookEntry) => {
										const currentDate = DateWithoutTime.fromString(bookEntry.date).getTime();
										return fromDate <= currentDate && currentDate < toDate;
									}
								);
								const year = date.getFullYear();
								const month = pad(date.getMonth() + 1, 2);
								const fileName = `book-entry-${year}-${month}_${unique}.csv`;
								exportFilesQueue.put({
									name: fileName,
									content: toJSONContent(bookEntries),
								});
								break;
							}
						}
						break;
					case 'EXPORT_PAYLOAD_TYPE/ALL':
						exportFilesQueue.put({
							name: `backup-${unique}.json`,
							content: toJSONContent({
								__version__: latestVersion,
								accounts: appState.accounts.accounts,
								templates: appState.transactions.templates,
								transactions: appState.transactions.transactions,
								bookEntries: appState.bookEntries.templates,
							}),
						});
						break;
				}
			} catch (e) {
				// eslint-disable-next-line
				console.log(e);
			}
		}
	};
};
