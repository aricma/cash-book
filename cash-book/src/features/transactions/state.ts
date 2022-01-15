export enum TransactionType {
    IN = 'TRANSACTION_TYPE/IN',
    OUT = 'TRANSACTION_TYPE/OUT',
    IN_AND_OUT = 'TRANSACTION_TYPE/IN_AND_OUT',
}

export interface TransactionsState {
    create: CreateTemplate;
    templates: {
        [templateId: string]: Template;
    };
    transactions: {
        [transactionId: string]: Transaction
    };
}

export interface CreateTemplate {
    id?: string;
    name?: string;
    cashierAccountId?: string;
    diffAccountId?: string;
    transactions: {
        [transactionId: string]: CreateTransaction;
    };
}

export interface CreateTransaction {
    id: string;
    type: TransactionType;
    order: number;
    name?: string;
    accountId?: string;
}

export interface Template {
    id: string;
    name: string;
    transactions: Array<string>;
}

export interface Transaction {
    id: string;
    order: number;
    type: TransactionType;
    fromAccountId: string;
    toAccountId: string;
    name: string;
}

export const initialState: TransactionsState = {
    create: {
        transactions: {},
    },
    templates: {},
    transactions: {}
};
