import {Validation} from './makeStateValidation';


export const validateEntries: Validation = (state) => {
    const hasTemplatesForIds = Object.keys(state.bookEntries.templates).reduce((isTrue, templateId) => {
        return isTrue && !!state.transactions.transactions[templateId];
    }, true);
    const hasTransactionsForIds = Object.values(state.bookEntries.templates).reduce((allTransactions: Array<string>, entries) => {
        return [
            ...allTransactions,
            ...Object.values(entries).reduce((allTransactions: Array<string>, entry) => {
                return [
                    ...allTransactions,
                    ...Object.keys(entry.transactions),
                ];
            }, []),
        ];
    }, []).reduce((isTrue, transactionId) => {
        return isTrue && !!state.transactions.transactions[transactionId];
    }, true);
    if (hasTemplatesForIds && hasTransactionsForIds) return null;
    return {
        templates: hasTemplatesForIds ? null : "Missing template for id!",
        transactions: hasTransactionsForIds ? null : "Missing transaction for id!",
    }
};
