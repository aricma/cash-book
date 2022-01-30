import { Validation } from './makeBackupValidation';

export const validateTransactions: Validation = (state) => {
	const hasTransactionsForTransactionIds = Object.values(state.templates)
		.reduce((allTransactions: Array<string>, template: any) => {
			return [...allTransactions, ...template.transactions];
		}, [])
		.reduce((isTrue, transactionId) => {
			return isTrue && !!state.transactions[transactionId];
		}, true);
	const hasAccountsForAccountIds = [
		...Object.values(state.templates).map((template: any) => template.cashierAccountId),
		...Object.values(state.templates).map((template: any) => template.diffAccountId),
		...Object.values(state.transactions).map((transaction: any) => {
			return transaction.accountId;
		}),
	].reduce((isTrue, accountId) => {
		return isTrue && !!state.accounts[accountId];
	}, true);
	if (hasTransactionsForTransactionIds && hasAccountsForAccountIds) return null;
	return {
		transactions: hasTransactionsForTransactionIds ? null : 'Missing transaction for id!',
		accounts: hasAccountsForAccountIds ? null : 'Missing account for id!',
	};
};
