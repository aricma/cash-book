import {ApplicationState} from '../../../applicationState';
import {CreateTransaction} from '../state';


interface CreateTemplateValidationMap {
    name?: string;
    cashierAccountId?: string;
    diffAccountId?: string;
}

export const validateCreateTemplate = (appState: ApplicationState): CreateTemplateValidationMap | undefined => {
    const name = !!appState.transactions.create.name ? undefined : 'Name is missing!';
    const cashierAccountId = !!appState.transactions.create.cashierAccountId ? undefined : 'Cashier is missing!';
    const diffAccountId = !!appState.transactions.create.diffAccountId ? undefined : 'Other account is missing!';
    if (name === undefined && cashierAccountId === undefined && diffAccountId === undefined) return undefined;
    return {
        name: name,
        cashierAccountId: cashierAccountId,
        diffAccountId: diffAccountId,
    };
};

interface CreateTransactionValidationMap {
    name?: string;
    accountId?: string;
}

export const validateCreateTransaction = (transaction: CreateTransaction): CreateTransactionValidationMap | undefined => {
    const name = !!transaction.name ? undefined : 'Name is missing!';
    const accountId = !!transaction.accountId ? undefined : 'Account is missing!';
    if (name === undefined && accountId === undefined) return undefined;
    return {
        name: name,
        accountId: accountId,
    };
};
