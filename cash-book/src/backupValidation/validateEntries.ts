import {Validation} from './makeBackupValidation';
import {
    MISSING_TRANSACTION_MESSAGE,
    MISSING_TEMPLATE_MESSAGE,
    TRANSACTION_FORMAT_MESSAGE,
    CASH_VALUE_FORMAT_MESSAGE,
} from './messages';


export const validateEntries: Validation = (state) => {
    const hasTemplatesForIds = Object.keys(state.bookEntries).reduce((isTrue, templateId) => {
        return isTrue && !!state.templates[templateId];
    }, true);
    const reduceEntries = (fn: (entry: any) => Array<string>) => (state: any): Array<string> => Object.values(state).reduce((all: Array<string>, entries: any) => {
        return [...all, ...Object.values(entries).reduce((all: Array<string>, entry: any) => [...all, ...fn(entry)], [])];
    }, []);
    const hasTransactionsForIds = reduceEntries((entry: any) => Object.keys(entry.transactions))(state.bookEntries).reduce((isTrue, transactionId) => {
        return isTrue && !!state.transactions[transactionId];
    }, true);
    const checkValueFormat = (values: Array<string>): boolean => {
        return values.reduce((hasCorrectFormat: boolean, value) => hasCorrectFormat && /\d+\.\d{2}/.test(value), true);
    };
    const hasFalseTransactionValueFormat = !checkValueFormat(reduceEntries(entry => Object.values(entry.transactions))(state.bookEntries));
    const hasFalseCashValueFormat = !checkValueFormat(reduceEntries(entry => [entry.cash.start, entry.cash.end])(state.bookEntries));
    if (
        hasTemplatesForIds &&
        hasTransactionsForIds &&
        !hasFalseTransactionValueFormat &&
        !hasFalseCashValueFormat
    ) return null;
    return {
        accounts: null,
        templates: hasTemplatesForIds ? null : MISSING_TEMPLATE_MESSAGE,
        transactions: hasTransactionsForIds ? null : MISSING_TRANSACTION_MESSAGE,
        bookEntries: (() => {
            switch (true) {
                case hasFalseTransactionValueFormat:
                    return TRANSACTION_FORMAT_MESSAGE;
                case hasFalseCashValueFormat:
                    return CASH_VALUE_FORMAT_MESSAGE;
                default:
                    return null;
            }
        })(),
    };
};
