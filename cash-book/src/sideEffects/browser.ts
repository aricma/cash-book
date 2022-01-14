import * as SE from 'redux-saga/effects';
import {
    BrowserLocalStorageSet,
    ApplicationActionType,
    BookEntriesExportDay,
    BookEntriesExportMonth,
} from '../applicationState/actions';
import {ApplicationState, selectAppState} from '../applicationState';
import {TransactionType} from '../features/transactions/state';
import {BookEntry} from '../features/bookEntries/state';
import {DateWithoutTime} from '../models/domain/date';
import {pad, getLastDateOfTheMonth, getFirstDateOfTheMonth} from '../models/utils';
import hash from 'crypto-js/sha256';

export const makeRemoveFromLocalStorage = (removeFromLocalStorage: (id: string) => void) => {
    return function* worker() {
        while (true) {
            try {
                const action: BrowserLocalStorageSet = yield SE.take(ApplicationActionType.BROWSER_LOCAL_STORAGE_REMOVE);
                removeFromLocalStorage(action.id);
            } catch (_) {

            }
        }
    };
};

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
                    const fileName = `book-entry-${year}-${month}-${day}_${unique}.csv`
                    exportRowsToCSV([headline, ...rows], fileName);
                }
            } catch (_) {

            }
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
                const fileName = `book-entry-${year}-${month}_${unique}.csv`
                exportRowsToCSV([headline, ...rows], fileName);
            } catch (_) {

            }
        }
    };
};

const bookEntryToRows = (appState: ApplicationState, bookEntry: BookEntry): Array<Array<string>> => {
    return Object.entries(bookEntry.transactions).map(([transactionId, value]) => {
        const transaction = appState.transactions.transactions[transactionId];
        return Array(headline.length).fill('').map((placeholder, index) => {
            switch (index) {
                case 0:
                    return 'EUR';
                case 1:
                    return (transaction.type === TransactionType.IN ? '+' : '-') + value;
                case 3: {
                    const date = DateWithoutTime.fromString(bookEntry.date);
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    return pad(day, 2) + pad(month, 2);
                }
                case 4:
                    return transaction.name;
                default:
                    return placeholder;
            }
        });
    });
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

const exportRowsToCSV = (rows: Array<Array<string>>, name?: string) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(row => {
        return row.map((cell) => `"${cell}"`).join(';');
    }).join('\n');
    const encodedUri = encodeURI(csvContent);

    if (name === undefined) {
        window.open(encodedUri);
    } else {
        // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name);
        link.setAttribute("class", "hidden");
        document.body.appendChild(link);
        link.click();
    }
};
