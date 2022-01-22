import { getTransactionValue, TransactionsWithValues } from './misc';
import { TransactionType } from '../transactions/state';

describe(getTransactionValue.name, () => {
	test('given balanced transactions, when called, then returns the expected value', () => {
		const transactionsWithValues: TransactionsWithValues = [
			{
				id: 'A',
				name: 'A',
				type: TransactionType.IN,
				value: '100.33',
				accountId: 'X',
			},
			{
				id: 'B',
				name: 'B',
				type: TransactionType.OUT,
				value: '90.66',
				accountId: 'Y',
			},
			{
				id: 'C',
				name: 'C',
				type: TransactionType.SYS_OUT,
				value: '9.67',
				accountId: 'Z',
			},
		];
		expect(getTransactionValue(transactionsWithValues)).toBe(0);
	});

	test('given unbalanced transactions, when called, then returns the expected value', () => {
		const transactionsWithValues: TransactionsWithValues = [
			{
				id: 'A',
				name: 'A',
				type: TransactionType.IN,
				value: '100.33',
				accountId: 'X',
			},
			{
				id: 'B',
				name: 'B',
				type: TransactionType.OUT,
				value: '40.66',
				accountId: 'Y',
			},
			{
				id: 'B',
				name: 'B',
				type: TransactionType.OUT,
				value: '40',
				accountId: 'Y',
			},
			{
				id: 'C',
				name: 'C',
				type: TransactionType.SYS_OUT,
				value: '9.67',
				accountId: 'Z',
			},
		];
		expect(getTransactionValue(transactionsWithValues)).toBe(10);
	});
});
