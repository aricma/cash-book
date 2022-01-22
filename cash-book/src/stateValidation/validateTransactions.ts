import {Validation} from './makeStateValidation';


export const validateTransactions: Validation = (state) => {
    const hasTransactionsForTransactionIds = Object.values(state.transactions.templates).reduce((allTransactions: Array<string>, template) => {
        return [
            ...allTransactions,
            ...template.transactions,
        ];
    }, []).reduce((isTrue, transactionId) => {
        return isTrue && !!state.transactions.transactions[transactionId];
    }, true);
    const hasAccountsForAccountIds = [
        ...Object.values(state.transactions.templates).map((template) => template.cashierAccountId),
        ...Object.values(state.transactions.templates).map((template) => template.diffAccountId),
        ...Object.values(state.transactions.transactions).map((transaction) => {
            return transaction.accountId
        }),
    ].reduce((isTrue, accountId) => {
        return isTrue && !!state.accounts.accounts[accountId];
    }, true);
    if (hasTransactionsForTransactionIds && hasAccountsForAccountIds) return null;
    return {
        transactions: hasTransactionsForTransactionIds ? null : "Missing transaction for id!",
        accounts: hasAccountsForAccountIds ? null : "Missing account for id!",
    }
};
