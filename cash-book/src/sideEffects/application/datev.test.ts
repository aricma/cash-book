import { validateDatevRows, bookEntryToDatevRows, INVALID_ROW_RESULT_MESSAGE } from './datev';
import { validRows, invalidRowsWrongResult, invalidRowsWrongFormat } from './fixtures';
import { TransactionType } from '../../features/transactions/state';
import { AccountType } from '../../features/accounts/state';
import { BookEntry } from '../../features/bookEntries/state';

describe(bookEntryToDatevRows.name, () => {
	const bookEntry: BookEntry = {
		date: '2000-1-1',
		templateId: '1',
		cash: {
			start: '100.00',
			end: '100.00',
		},
		transactions: {
			A: '10.00',
			B: '40.00',
			C: '50.00',
			D: '100.00',
			E: '5.00',
			F: '5.00',
		},
	};
	const transactions = {
		A: {
			id: 'A',
			name: 'In 1',
			type: TransactionType.IN,
			accountId: 'A',
		},
		B: {
			id: 'B',
			name: 'In 2',
			type: TransactionType.IN,
			accountId: 'A',
		},
		C: {
			id: 'C',
			name: 'In 3',
			type: TransactionType.IN,
			accountId: 'A',
		},
		D: {
			id: 'D',
			name: 'Out',
			type: TransactionType.OUT,
			accountId: 'B',
		},
		E: {
			id: 'E',
			name: 'Diff In',
			type: TransactionType.SYS_IN,
			accountId: 'C',
		},
		F: {
			id: 'F',
			name: 'Diff Out',
			type: TransactionType.SYS_OUT,
			accountId: 'C',
		},
	};
	const accounts = {
		A: {
			id: 'A',
			name: 'In Acc',
			type: AccountType.DEFAULT,
			number: '1000',
		},
		B: {
			id: 'B',
			name: 'Out Acc',
			type: AccountType.DEFAULT,
			number: '1500',
		},
		C: {
			id: 'C',
			name: 'Diff Acc',
			type: AccountType.DIFFERENCE,
			number: '2000',
		},
		D: {
			id: 'D',
			name: 'Cash Acc',
			type: AccountType.CASH_STATION,
			number: '5000',
		},
	};

	test('when called with valid request, returns rows', () => {
		expect(
			bookEntryToDatevRows({
				bookEntry: bookEntry,
				transactions: transactions,
				accounts: accounts,
			})
		).toEqual([
			['EUR', '+10,00', 'In 1', '0101', 'In Acc', '', '', '1000', '', '', '', '', ''],
			['EUR', '+40,00', 'In 2', '0101', 'In Acc', '', '', '1000', '', '', '', '', ''],
			['EUR', '+50,00', 'In 3', '0101', 'In Acc', '', '', '1000', '', '', '', '', ''],
			['EUR', '-100,00', 'Out', '0101', 'Out Acc', '', '', '1500', '', '', '', '', ''],
			['EUR', '+5,00', 'Diff In', '0101', 'Diff Acc', '', '', '2000', '', '', '', '', ''],
			['EUR', '-5,00', 'Diff Out', '0101', 'Diff Acc', '', '', '2000', '', '', '', '', ''],
		]);
	});

	test('when called with invalid request, throws', () => {
		expect(() =>
			bookEntryToDatevRows({
				rowLength: 13,
				bookEntry: {
					...bookEntry,
					transactions: {
						...bookEntry.transactions,
						G: '10.00',
					},
				},
				transactions: {
					...transactions,
					G: {
						id: 'G',
						name: 'Some',
						// @ts-ignore
						type: 'FALSE_TYPE',
						accountId: 'A',
					},
				},
				accounts: accounts,
			})
		).toThrow(Error('Unknown TransactionType: FALSE_TYPE'));
	});
});

describe(validateDatevRows.name, () => {
	test('given valid rows, when called, then returns null', () => {
		expect(validateDatevRows(validRows)).toBe(null);
	});

	test('given invalid rows(wrong aggregated result), when called, then returns error message', () => {
		expect(validateDatevRows(invalidRowsWrongResult)).toStrictEqual(INVALID_ROW_RESULT_MESSAGE('5.00'));
	});

	test('given invalid rows(value format), when called, then returns error message', () => {
		expect(validateDatevRows(invalidRowsWrongFormat)).toStrictEqual(null);
	});
});
