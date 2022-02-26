import { ApplicationState } from '../../../applicationState';
import { BookEntriesState } from '../../bookEntries/state';
import { TransactionsState } from '../../transactions/state';
import { transactionValue } from '../../bookEntries/misc';
import { compact, toNumber } from '../../../models/utils';

interface CreateBookEntryValidationMap {
	transactions?: {
		[transactionId: string]: string | undefined;
	};
	value?: string;
}

export const validateCreateBookEntry = (appState: ApplicationState): CreateBookEntryValidationMap | null => {
	const transactions = validateTransactions(appState.bookEntries, appState.transactions);
	const value = validateTransactionValue(appState);

	const hasAllTransactions = transactions === undefined;
	const isBalanced = value === undefined;
	if (hasAllTransactions && isBalanced) return null;

	return {
		transactions: transactions,
		value: value,
	};
};

export const validateIfDateExists = (state: BookEntriesState): string | null => {
	const selectedTemplateId = state.selectedTemplateId;
	if (selectedTemplateId === undefined) return null;
	const templateConfig = state.create.templates[selectedTemplateId];
	if (templateConfig === undefined) return null;
	const allDates = Object.keys(state.templates[templateConfig.templateId] || {});
	const dateExists = allDates.includes(templateConfig.date);
	return dateExists ? DATE_EXISTS_MESSAGE : null;
};

const validateTransactions = (
	bookEntriesState: BookEntriesState,
	transactionsState: TransactionsState
): { [transactionId: string]: string | undefined } | undefined => {
	const selectedTemplateId = bookEntriesState.selectedTemplateId;
	if (selectedTemplateId === undefined) return undefined;
	const template = transactionsState.templates[selectedTemplateId];
	const config = bookEntriesState.create.templates[selectedTemplateId];
	if (template === undefined) return undefined;
	if (config === undefined) return undefined;
	const map = template.transactionIds.reduce((map, transactionId) => {
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
	if ((toNumber(value) || 0) === 0) return TRANSACTION_IS_ZERO_MESSAGE;
	if (!/^\d+[.]\d{2}$/.test(value)) return TRANSACTION_FORMAT_MESSAGE;
	return undefined;
};

const validateTransactionValue = (appState: ApplicationState): string | undefined => {
	const selectedTemplateId = appState.bookEntries.selectedTemplateId;
	if (selectedTemplateId === undefined) return undefined;
	const config = appState.bookEntries.create.templates[selectedTemplateId];
	if (config === undefined) return undefined;
	if (config.diffTransaction) return undefined;
	const value = transactionValue(appState);
	return value === 0 ? undefined : TRANSACTION_RESULT_MESSAGE(String(value));
};

export const DATE_EXISTS_MESSAGE = 'Date already exists!';
export const TRANSACTION_IS_ZERO_MESSAGE = 'Transactions can not be 0!';
export const TRANSACTION_FORMAT_MESSAGE = 'Value needs 2 decimals(format: 0.00)!';
export const TRANSACTION_RESULT_MESSAGE = (value: string) => 'Transactions result to ' + value + '!';
