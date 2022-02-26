import { CreateTransaction, CreateTemplate } from '../state';

interface CreateTemplateValidationMap {
	name?: string;
	cashierAccountId?: string;
	diffAccountId?: string;
}

export const validateCreateTemplate = (state: CreateTemplate): CreateTemplateValidationMap | null => {
	const name = !!state.name ? undefined : MISSING_NAME_MESSAGE;
	const cashierAccountId = !!state.cashierAccountId ? undefined : MISSING_CASHIER_ACCOUNT_MESSAGE;
	const diffAccountId = !!state.diffAccountId ? undefined : MISSING_DIFF_ACCOUNT_MESSAGE;
	if (name === undefined && cashierAccountId === undefined && diffAccountId === undefined) return null;
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

export const validateCreateTransaction = (transaction: CreateTransaction): CreateTransactionValidationMap | null => {
	const name = !!transaction.name ? undefined : MISSING_NAME_MESSAGE;
	const accountId = !!transaction.accountId ? undefined : MISSING_ACCOUNT_MESSAGE;
	if (name === undefined && accountId === undefined) return null;
	return {
		name: name,
		accountId: accountId,
	};
};

export const MISSING_NAME_MESSAGE = 'Name is missing!';
export const MISSING_ACCOUNT_MESSAGE = 'Account is missing!';
export const MISSING_CASHIER_ACCOUNT_MESSAGE = 'Cashier is missing!';
export const MISSING_DIFF_ACCOUNT_MESSAGE = 'Difference account is missing!';
