import { ApplicationState } from '../../applicationState';
import { Export, ExportFileType, ExportPayloadType } from '../../applicationState/actions';
import { WriteToFileConfig } from './makeWriteToFile';
import {
	toCSVContent,
	toJSONContent,
	toDateString,
	toLowerCaseWithDashes,
	bookEntriesForMonth,
} from '../../misc/utils';
import { compactObject, pad } from '../../models/utils';
import { latestVersion } from '../../backupMigrations';
import { headline, bookEntryToDatevRows, validateDatevRows } from './datev';
import { DateWithoutTime } from '../../models/dateWithoutTime';

interface Request {
	appState: ApplicationState;
	unique: string;
	action: Export;
}
export type ToExportFileConfig = (req: Request) => WriteToFileConfig | null;
export const toWriteToFileConfig: ToExportFileConfig = (req) => {
	switch (req.action.payload.type) {
		case ExportPayloadType.ACCOUNTS:
			switch (req.action.payload.fileType) {
				case ExportFileType.CSV:
					const headline = ['id', 'name', 'type', 'number'];
					const rows = Object.values(req.appState.accounts.accounts).map((account): Array<string> => {
						return [account.id, account.name, account.type, account.number];
					});
					return {
						name: `accounts-${req.unique}.csv`,
						content: toCSVContent([headline, ...rows]),
					};
				case ExportFileType.JSON:
					return {
						name: `accounts-${req.unique}.json`,
						content: toJSONContent(req.appState.accounts.accounts),
					};
				default:
					return null;
			}
		case ExportPayloadType.TRANSACTIONS:
			return {
				name: `transactions-${req.unique}.json`,
				content: toJSONContent(
					compactObject({
						...req.appState.transactions,
						create: undefined,
					})
				),
			};
		case ExportPayloadType.BOOK_ENTRIES:
			const selectedTemplateId = req.appState.bookEntries.selectedTemplateId;
			if (selectedTemplateId === undefined) return null;
			switch (req.action.payload.fileType + '-' + req.action.payload.range) {
				case ExportFileType.DATEV_CSV + '-day': {
					const bookEntry = req.appState.bookEntries.templates[selectedTemplateId][req.action.payload.date];
					if (bookEntry === undefined) return null;
					const rows = bookEntryToDatevRows({
						bookEntry: bookEntry,
						accounts: req.appState.accounts.accounts,
						transactions: req.appState.transactions.transactions,
					});
					const rowsValidation = validateDatevRows(rows);
					const rowsAreNotValid = rowsValidation !== null;
					if (rowsAreNotValid) throw Error(rowsValidation);
					const cashierName = toLowerCaseWithDashes(req.appState.transactions.templates[selectedTemplateId].name);
					const date = toDateString(req.action.payload.date);
					const fileName = `book-entry-${cashierName}-${date}-${req.unique}.csv`;
					return {
						name: fileName,
						content: toCSVContent([headline, ...rows]),
					};
				}
				case ExportFileType.DATEV_CSV + '-month': {
					const date = DateWithoutTime.fromString(req.action.payload.date);
					const bookEntries = bookEntriesForMonth(date, req.appState.bookEntries.templates[selectedTemplateId]);
					const rows = Object.values(bookEntries).reduce((rows: Array<Array<string>>, bookEntry) => {
						return [
							...rows,
							...bookEntryToDatevRows({
								bookEntry: bookEntry,
								accounts: req.appState.accounts.accounts,
								transactions: req.appState.transactions.transactions,
							}),
						];
					}, []);
					const rowsValidation = validateDatevRows(rows);
					const rowsAreNotValid = rowsValidation !== null;
					if (rowsAreNotValid) throw Error(rowsValidation);
					const cashierName = toLowerCaseWithDashes(req.appState.transactions.templates[selectedTemplateId].name);
					const year = date.getFullYear();
					const month = pad(date.getMonth() + 1, 2);
					const fileName = `book-entries-${cashierName}-${year}-${month}-${req.unique}.csv`;
					return {
						name: fileName,
						content: toCSVContent([headline, ...rows]),
					};
				}
				case ExportFileType.JSON + '-day': {
					const bookEntry = req.appState.bookEntries.templates[selectedTemplateId][req.action.payload.date];
					if (bookEntry === undefined) return null;
					const date = toDateString(req.action.payload.date);
					const cashierName = toLowerCaseWithDashes(req.appState.transactions.templates[selectedTemplateId].name);
					const fileName = `book-entry-${cashierName}-${date}-${req.unique}.json`;
					return {
						name: fileName,
						content: toJSONContent(bookEntry),
					};
				}
				case ExportFileType.JSON + '-month': {
					const date = DateWithoutTime.fromString(req.action.payload.date);
					const bookEntries = bookEntriesForMonth(date, req.appState.bookEntries.templates[selectedTemplateId]);
					const cashierName = toLowerCaseWithDashes(req.appState.transactions.templates[selectedTemplateId].name);
					const year = date.getFullYear();
					const month = pad(date.getMonth() + 1, 2);
					const fileName = `book-entries-${cashierName}-${year}-${month}-${req.unique}.json`;
					return {
						name: fileName,
						content: toJSONContent(bookEntries),
					};
				}
				default:
					return null;
			}
		case ExportPayloadType.ALL:
			return {
				name: `backup-${req.unique}.json`,
				content: toJSONContent({
					__version__: latestVersion,
					accounts: req.appState.accounts.accounts,
					templates: req.appState.transactions.templates,
					transactions: req.appState.transactions.transactions,
					bookEntries: req.appState.bookEntries.templates,
				}),
			};
		default:
			return null;
	}
};
