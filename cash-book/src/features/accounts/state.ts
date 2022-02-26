export interface AccountsState {
	create: CreateAccount;
	accounts: Accounts;
}

export type Accounts = {
	[accountId: string]: Account;
};

export enum AccountType {
	DEFAULT = 'ACCOUNT_TYPE/DEFAULT',
	CASH_STATION = 'ACCOUNT_TYPE/CASH_STATION',
	DIFFERENCE = 'ACCOUNT_TYPE/DIFFERENCE',
}

export interface CreateAccount {
	id?: string;
	type: AccountType;
	name?: string;
	number?: string;
}

export interface Account {
	id: string;
	type: AccountType;
	name: string;
	number: string;
}

export const initialState: AccountsState = {
	create: {
		type: AccountType.DEFAULT,
	},
	accounts: {},
};
