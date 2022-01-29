import {ApplicationState} from '../../../applicationState';
import {AccountType} from '../../accounts/state';
import {transactionValue} from '../../bookEntries/misc';
import {compact, toNumber} from '../../../models/utils';


interface CreateBookEntryValidationMap {
    transactions?: {
        [transactionId: string]: string | undefined;
    };
    value?: string;
}

export const validateCreateBookEntry = (appState: ApplicationState): CreateBookEntryValidationMap | undefined => {
    const transactions = validateTransactions(appState);
    const value = validateTransactionValue(appState);

    const hasAllTransactions = transactions === undefined;
    const isBalanced = value === undefined;
    if (hasAllTransactions && isBalanced) return undefined;

    return {
        transactions: transactions,
        value: value,
    };
};

export const validateIfDateExists = (appState: ApplicationState): string | undefined => {
    const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.selectedTemplateId || ''];
    if (templateConfig === undefined) return undefined;
    const entries = appState.bookEntries.templates[templateConfig.templateId] || {};
    return Object.keys(entries).includes(templateConfig.date) ? 'Date already exists!' : undefined;
};

const validateTransactions = (
    appState: ApplicationState,
): { [transactionId: string]: string | undefined } | undefined => {
    const selectedTemplateId = appState.bookEntries.selectedTemplateId;
    if (selectedTemplateId === undefined) return undefined;
    const template = appState.transactions.templates[selectedTemplateId];
    const config = appState.bookEntries.create.templates[selectedTemplateId];
    if (template === undefined) return undefined;
    if (config === undefined) return undefined;
    const map = template.transactions.reduce((map, transactionId) => {
        const value = config.transactions[transactionId];
        return {
            ...map,
            [transactionId]: validateTransaction(value),
        };
    }, {});
    if (compact(Object.values(map)).length === 0) return undefined;
    return map;
};

const validateTransaction = (value?: string): string | undefined => {
    if (value === undefined) return undefined;
    if (value === '') return undefined;
    if ((toNumber(value) || 0) === 0) return 'Transactions can not be 0!';
    if (!/^\d+[.]\d{2}$/.test(value)) return 'Value needs 2 decimals(format: 0.00)!';
    return undefined;
};

const validateTransactionValue = (appState: ApplicationState): string | undefined => {
    const selectedTemplateId = appState.bookEntries.selectedTemplateId;
    if (selectedTemplateId === undefined) return 'No Template selected!';
    const config = appState.bookEntries.create.templates[selectedTemplateId];
    if (config === undefined) return 'Found no config!';
    if (config.diffTransaction) return undefined;
    const cashierAccount =
        Object.values(appState.accounts.accounts).find(({type}) => {
            return type === AccountType.CASH_STATION;
        }) || undefined;
    if (cashierAccount === undefined) return 'Cashier account is missing!';
    const differenceAccount =
        Object.values(appState.accounts.accounts).find(({type}) => {
            return type === AccountType.DIFFERENCE;
        }) || undefined;
    if (differenceAccount === undefined) return 'Difference account is missing!';
    const value = transactionValue(appState);
    return value === 0 ? undefined : 'Transactions result to ' + value + '!';
};
