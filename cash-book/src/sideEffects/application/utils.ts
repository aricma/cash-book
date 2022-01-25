import { ApplicationState } from '../../applicationState';
import { BookEntry } from '../../features/bookEntries/state';
import { TransactionType } from '../../features/transactions/state';
import { DateWithoutTime } from '../../models/domain/date';
import { pad } from '../../models/utils';

export const headline = [
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

export const bookEntryToRows = (appState: ApplicationState, bookEntry: BookEntry): Array<Array<string>> => {
	return Object.entries(bookEntry.transactions).map(([transactionId, value]) => {
		const transaction = appState.transactions.transactions[transactionId];
		const account = appState.accounts.accounts[transaction.accountId];
		return Array(headline.length)
			.fill('')
			.map((placeholder, index) => {
				switch (index) {
					case 0:
						return 'EUR';
					case 1: {
						const parsedValue = value.replace('.', ',');
						switch (transaction.type) {
							case TransactionType.IN:
							case TransactionType.SYS_IN:
								return '+' + parsedValue;
							case TransactionType.OUT:
							case TransactionType.SYS_OUT:
								return '-' + parsedValue;
							default:
								return '';
						}
					}
					case 3: {
						const date = DateWithoutTime.fromString(bookEntry.date);
						const day = date.getDate();
						const month = date.getMonth() + 1;
						return pad(day, 2) + pad(month, 2);
					}
					case 4:
						return account.name;
					case 7:
						return account.number;
					case 12:
						return transaction.name;
					default:
						return placeholder;
				}
			});
	});
};

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
export const exportToFile = (content: string, name?: string) => {
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

export const toCSVContent = (rows: Array<Array<string>>): string => {
	return (
		'data:text/csv;charset=utf-8,' +
		rows
			.map((row) => {
				return row.map((cell) => `"${cell}"`).join(';');
			})
			.join('\n')
	);
};

export const toJSONContent = (object: any) => {
	return 'data:text/json;charset=utf-8,' + JSON.stringify(object);
};

export const setInLocalStorage = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};

export const loadFromLocalStorage = (key: string) => {
	return window.localStorage.getItem(key) || undefined;
};
