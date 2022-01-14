export enum TransactionType {
	IN = 'TRANSACTION_TYPE/IN',
	OUT = 'TRANSACTION_TYPE/OUT',
	IN_AND_OUT = 'TRANSACTION_TYPE/IN_AND_OUT',
}

export interface TransactionsState {
	create: {
		type: TransactionType;
		name?: string;
		cashierAccountId?: string;
		otherAccountId?: string;
	};
	transactions: {
		[transactionId: string]: Transaction;
	};
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
		type: TransactionType.OUT,
	},
	transactions: {},
};
