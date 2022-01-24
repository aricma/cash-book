import { BookEntriesExportMonth, ApplicationActionType } from '../../applicationState/actions';
import * as SE from 'redux-saga/effects';
import { ApplicationState, selectAppState } from '../../applicationState';
import { DateWithoutTime } from '../../models/domain/date';
import { getFirstDateOfTheMonth, getLastDateOfTheMonth, pad } from '../../models/utils';
import hash from 'crypto-js/sha256';
import { toCSVContent, exportToFile, bookEntryToRows, headline } from './utils';

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
			} catch (e) {
				console.log(e);
			}
		}
	};
};
