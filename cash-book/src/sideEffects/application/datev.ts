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

export const bookEntryToDatevRows = (appState: ApplicationState, bookEntry: BookEntry): Array<Array<string>> => {
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

export const validateDatevRows = (rows: Array<Array<string>>): null | string => {
	const result = rows.reduce((result: number, row: Array<string>) => {
		const value = Number(row[1].replace('+', '').replace(',', '.')) * 100;
		return result + value;
	}, 0);
	return result === 0 ? null : `The Rows add up to: ${result / 100}!`;
};
