import { BookEntriesExportDay, ApplicationActionType } from '../../applicationState/actions';
import * as SE from 'redux-saga/effects';
import { ApplicationState, selectAppState } from '../../applicationState';
import { DateWithoutTime } from '../../models/domain/date';
import { pad } from '../../models/utils';
import hash from 'crypto-js/sha256';
import { toCSVContent, exportToFile, bookEntryToRows, headline } from './utils';

export const makeBookEntriesExportDay = () => {
	return function* worker() {
		while (true) {
			try {
				const action: BookEntriesExportDay = yield SE.take(ApplicationActionType.BOOK_ENTRIES_EXPORT_DAY);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const selectedTemplatesId = appState.bookEntries.selectedTemplateId;
				if (selectedTemplatesId === undefined) continue;
				const bookEntry = appState.bookEntries.templates[selectedTemplatesId][action.date];
				if (bookEntry === undefined) continue;
				const rows = bookEntryToRows(appState, bookEntry);
				const timeOfDownload = new Date().toISOString();
				const date = DateWithoutTime.fromString(action.date);
				const year = date.getFullYear();
				const month = pad(date.getMonth() + 1, 2);
				const day = pad(date.getDate(), 2);
				const unique = hash(timeOfDownload);
				const fileName = `book-entry-${year}-${month}-${day}_${unique}.csv`;
				exportToFile(toCSVContent([headline, ...rows]), fileName);
			} catch (e) {
				// eslint-disable-next-line
				console.log(e);
			}
		}
	};
};
