export enum TransactionType {
	IN = 'TRANSACTION_TYPE/IN',
	OUT = 'TRANSACTION_TYPE/OUT',
	SYS_IN = 'TRANSACTION_TYPE/PROTECTED/IN',
	SYS_OUT = 'TRANSACTION_TYPE/PROTECTED/OUT',
}

export interface TransactionsState {
	create: CreateTemplate;
	templates: {
		[templateId: string]: Template;
	};
	transactions: {
		[transactionId: string]: Transaction;
	};
}

export interface CreateTemplate {
	id?: string;
	name?: string;
	cashierAccountId?: string;
	diffAccountId?: string;
	transactionIds: Array<string>;
	autoDiffInId?: string;
	autoDiffOutId?: string;
	transactions: {
		[transactionId: string]: CreateTransaction;
	};
}

export interface CreateTransaction {
	id: string;
	type: TransactionType;
	name?: string;
	accountId?: string;
}

export interface Template {
	id: string;
	name: string;
	cashierAccountId: string;
	diffAccountId: string;
	transactions: Array<string>;
	autoDiffInId: string;
	autoDiffOutId: string;
}

export interface Transaction {
	id: string;
	type: TransactionType;
	accountId: string;
	name: string;
}

export const initialState: TransactionsState = {
	create: {
		transactionIds: [],
		transactions: {},
	},
	templates: {},
	transactions: {},
};
