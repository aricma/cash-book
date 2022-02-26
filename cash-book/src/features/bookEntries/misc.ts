import { ApplicationState } from '../../applicationState';
import { AccountType, Account } from '../accounts/state';
import { TransactionType, Transaction } from '../transactions/state';
import { toCurrencyInt } from '../../models/currencyInt';

export const transactionValue = (appState: ApplicationState): number => {
	const selectedTemplateId = appState.bookEntries.selectedTemplateId;
	if (selectedTemplateId === undefined) return 0;
	const template = appState.transactions.templates[selectedTemplateId];
	const config = appState.bookEntries.create.templates[selectedTemplateId];
	const accounts = Object.values(appState.accounts.accounts);
	const cashierAccount = accounts.find(({ type }) => type === AccountType.CASH_STATION) || undefined;
	const differenceAccount = accounts.find(({ type }) => type === AccountType.DIFFERENCE) || undefined;
	if (cashierAccount === undefined) return 0;
	if (differenceAccount === undefined) return 0;

	const transactionsWithValues: TransactionsWithValues = template.transactionIds.map(
		(transactionId): TransactionWithValue => {
			const transaction = appState.transactions.transactions[transactionId];
			const value = config.transactions[transactionId] || '0';
			return { ...transaction, value };
		}
	);
	return getTransactionValue(transactionsWithValues);
};

export type TransactionWithValue = Transaction & { value: string };
export type TransactionsWithValues = Array<TransactionWithValue>;
export const getTransactionValue = (transactionsWithValues: TransactionsWithValues): number => {
	return (
		transactionsWithValues.reduce((value, transaction) => {
			const transactionValue = toCurrencyInt(transaction.value) || 0;
			switch (transaction.type) {
				case TransactionType.IN:
				case TransactionType.SYS_IN:
					return value + transactionValue;
				case TransactionType.OUT:
				case TransactionType.SYS_OUT:
				default:
					return value - transactionValue;
			}
		}, 0) / 100
	);
};

export type AccountWithValue = Account & { value: number };
export const accountWithValue = (
	account: Account,
	transactionsWithValues: TransactionsWithValues
): AccountWithValue => {
	return { ...account, value: getTransactionValue(transactionsWithValues) };
};
