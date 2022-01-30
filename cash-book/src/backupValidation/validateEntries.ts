import { Validation } from './makeBackupValidation';

export const validateEntries: Validation = (state) => {
	const hasTemplatesForIds = Object.keys(state.bookEntries).reduce((isTrue, templateId) => {
		return isTrue && !!state.templates[templateId];
	}, true);
	const hasTransactionsForIds = Object.values(state.bookEntries)
		.reduce((allTransactions: Array<string>, entries: any) => {
			return [
				...allTransactions,
				...Object.values(entries).reduce((allTransactions: Array<string>, entry: any) => {
					return [...allTransactions, ...Object.keys(entry.transactions)];
				}, []),
			];
		}, [])
		.reduce((isTrue, transactionId) => {
			return isTrue && !!state.transactions[transactionId];
		}, true);
	if (hasTemplatesForIds && hasTransactionsForIds) return null;
	return {
		templates: hasTemplatesForIds ? null : 'Missing template for id!',
		transactions: hasTransactionsForIds ? null : 'Missing transaction for id!',
	};
};
