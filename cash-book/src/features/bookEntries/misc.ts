import {ApplicationState} from '../../applicationState';
import {AccountType} from '../accounts/state';
import {TransactionType} from '../transactions/state';
import {toNumber} from '../../models/utils';


export const transactionValue = (appState: ApplicationState): number => {
    const selectedTemplateId = appState.bookEntries.create.selectedTemplateId;
    if (selectedTemplateId === undefined) return 0;
    const template = appState.transactions.templates[selectedTemplateId];
    if (template === undefined) return 0;
    const config = appState.bookEntries.create.templates[selectedTemplateId];
    if (config === undefined) return 0;
    const cashierAccount = Object.values(appState.accounts.accounts).find(({type}) => {
        return type === AccountType.CASH_STATION;
    }) || undefined;
    if (cashierAccount === undefined) return 0;
    const differenceAccount = Object.values(appState.accounts.accounts).find(({type}) => {
        return type === AccountType.DIFFERENCE;
    }) || undefined;
    if (differenceAccount === undefined) return 0;

    return template.transactions.reduce((value, transactionId) => {
        const transaction = appState.transactions.transactions[transactionId];
        const transactionValue = toNumber(config.transactions[transactionId]) || 0;
        if (transaction.type === TransactionType.OUT) {
            return value - transactionValue;
        } else {
            return value + transactionValue;
        }
    }, 0);
};
