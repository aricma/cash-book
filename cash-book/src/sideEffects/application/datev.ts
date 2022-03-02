import {Account} from '../../features/accounts/state';
import {BookEntry} from '../../features/bookEntries/state';
import {TransactionType, Transaction} from '../../features/transactions/state';
import {DateWithoutTime} from '../../models/dateWithoutTime';
import {CurrencyInt} from '../../models/currencyInt';
import {pad} from '../../models/utils';


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

interface BookEntryToDatevRowsRequest {
	bookEntry: BookEntry;
	transactions: { [key: string]: Transaction };
	accounts: { [key: string]: Account };
}

export const bookEntryToDatevRows = (req: BookEntryToDatevRowsRequest): Array<Array<string>> => {
	return Object.entries(req.bookEntry.transactions).map(([transactionId, value]) => {
		const transaction = req.transactions[transactionId];
		const account = req.accounts[transaction.accountId];
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
								throw Error('Unknown TransactionType: ' + transaction.type);
						}
					}
					case 2:
						return transaction.name;
					case 3: {
						const date = DateWithoutTime.fromString(req.bookEntry.date);
						const day = date.getDate();
						const month = date.getMonth() + 1;
						return pad(day, 2) + pad(month, 2);
					}
					case 4:
						return account.name;
					case 7:
						return account.number;
					default:
						return placeholder;
				}
			});
	});
};

export const validateDatevRows = (rows: Array<Array<string>>): string | null => {
	try {
		const result = rows.reduce((result: number, row: Array<string>, i) => {
			const value = CurrencyInt.fromString(row[1].replace(/[,]/, '.'));
			if (value === null) throw Error(`validateDatevRows: invalid value found in row [${i}]: ${row[1]}!`)
			return result + value;
		}, 0);
		return result === 0 ? null : INVALID_ROW_RESULT_MESSAGE(CurrencyInt.toString(result));
	} catch (e) {
		return null;
	}
};

export const INVALID_ROW_RESULT_MESSAGE = (result: string) =>
	`Datev Export: The entries add up to: ${result}! The result should be 0!`;
