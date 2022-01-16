export interface AccountsState {
	create: {
		id?: string;
		type: AccountType;
		name?: string;
		number?: string;
	};
	accounts: {
		[accountId: string]: Account;
	};
}

export enum AccountType {
	DEFAULT = 'ACCOUNT_TYPE/DEFAULT',
	CASH_STATION = 'ACCOUNT_TYPE/CASH_STATION',
	DIFFERENCE = 'ACCOUNT_TYPE/DIFFERENCE',
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
