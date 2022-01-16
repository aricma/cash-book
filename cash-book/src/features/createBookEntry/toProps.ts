import { AccountType } from '../accounts/state';
import { ApplicationActionType } from '../../applicationState/actions';
import {
	CreateBookEntryViewProps,
	OverrideDateConfirmationModalViewProps,
	CreateBookEntryTemplateConfigProps,
} from './props';
import { ApplicationState, dispatch } from '../../applicationState';
import { DateWithoutTime } from '../../models/domain/date';
import { compact, subtractDays } from '../../models/utils';
import { IconType } from '../../models/props';
import { transactionValue } from '../bookEntries/misc';
import { ROUTES_BOOK_ENTRIES } from '../../variables/routes';

interface ToCreateBookEntryViewPropsRequest {
	appState: ApplicationState;
	showValidation: boolean;
	setShowValidation: () => void;
	openDateOverrideConfirmationModal: () => void;
}

export const toCreateBookEntryViewProps = (req: ToCreateBookEntryViewPropsRequest): CreateBookEntryViewProps => {
	return {
		title: 'New Book Entry',
		template: {
			type: 'OPTIONS_INPUT_PROPS_TYPE',
			value: req.appState.transactions.templates[req.appState.bookEntries.create.selectedTemplateId || '']?.name || '',
			placeholder: 'Set transaction template',
			options: Object.values(req.appState.transactions.templates).map((template) => ({
				type: 'BUTTON_PROPS_TYPE',
				title: template.name,
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
						templateId: template.id,
					});
				},
			})),
		},
		templateConfig: toTemplateConfigProps(req),
	};
};

interface ToTemplateConfigPropsRequest {
	appState: ApplicationState;
	showValidation: boolean;
	setShowValidation: () => void;
	openDateOverrideConfirmationModal: () => void;
}

export const toTemplateConfigProps = (
	req: ToTemplateConfigPropsRequest
): CreateBookEntryTemplateConfigProps | undefined => {
	const selectedTemplateId = req.appState.bookEntries.create.selectedTemplateId;
	const config = req.appState.bookEntries.create.templates[selectedTemplateId || ''];
	const template = req.appState.transactions.templates[selectedTemplateId || ''];
	if (config === undefined) return undefined;
	if (template === undefined) return undefined;
	const validationMap = validateCreateBookEntry(req.appState);
	const diffValue = transactionValue(req.appState);
	const cashierAccount = req.appState.accounts.accounts[template.cashierAccountId];
	const diffAccount = req.appState.accounts.accounts[template.diffAccountId];
	if (cashierAccount === undefined) return undefined;
	if (diffAccount === undefined) return undefined;
	const needsDateOverrideConfirmation = validateIfDateExists(req.appState) !== undefined;
	const dateDisplay = DateWithoutTime.fromString(config.date).toLocaleDateString('de-DE', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	return {
		date: {
			input: {
				type: 'DATE_PICKER_INPUT_PROPS',
				label: dateDisplay,
				value: config.date,
				onChange: (date) => {
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
						templateId: config.templateId,
						date: date,
					});
				},
			},
			today: {
				type: 'BUTTON_PROPS_TYPE',
				title: 'Today',
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
						templateId: config.templateId,
						date: DateWithoutTime.new().toISOString(),
					});
				},
			},
			yesterday: {
				type: 'BUTTON_PROPS_TYPE',
				title: 'Yesterday',
				onSelect: () => {
					const today = DateWithoutTime.new();
					const yesterday = subtractDays(today, 1);
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
						templateId: config.templateId,
						date: yesterday.toISOString(),
					});
				},
			},
		},
		transactions: template.transactions.map((transactionsId) => {
			const transaction = req.appState.transactions.transactions[transactionsId];
			return {
				type: 'TEXT_INPUT_PROPS_TYPE',
				label: transaction.name,
				value: config.transactions[transaction.id] || '',
				placeholder: '',
				validation: req.showValidation
					? validationMap?.transactions === undefined
						? undefined
						: validationMap?.transactions[transaction.id]
					: undefined,
				onFinish: (value) => {
					let newValue = value;
					if (/^[.,]+.*$/.test(newValue)) newValue = '0.' + newValue.replace(/[,.]+/, '');
					if (/^[.,]$/.test(newValue)) newValue = '0';
					if (/^[.,]\d+$/.test(newValue)) newValue = '0' + newValue;
					if (/^\d+[.,]$/.test(newValue)) newValue = newValue.slice(0, -1);
					if (/^\d+[.,]\d$/.test(newValue)) newValue = newValue + '0';
					if (/^\d+[,]\d{2}$/.test(newValue)) newValue = newValue.replace(',', '.');
					if (newValue === value) return;
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
						templateId: config.templateId,
						transactionId: transaction.id,
						value: newValue,
					});
				},
				onChange: (value) => {
					const newValue = ((): string | undefined => {
						if (!/^[\d.,]*$/.test(value)) return undefined;
						if (/^\d+[.,]\d{2}.$/.test(value)) return undefined;
						return value;
					})();
					if (newValue === undefined) return;
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
						templateId: config.templateId,
						transactionId: transaction.id,
						value: newValue,
					});
				},
			};
		}),
		addTransaction: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.PLUS_FILL,
			title: 'Add Transaction',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
				});
			},
		},
		diffTransaction:
			diffValue !== 0
				? {
						title: 'Difference Transaction',
						cashierAccount: cashierAccount.name,
						direction: diffValue < 0 ? IconType.ARROW_NARROW_LEFT_STROKE : IconType.ARROW_NARROW_RIGHT_STROKE,
						diffAccount: diffAccount.name,
						value: '' + Math.abs(diffValue),
						description:
							'If you enable this transaction we automatically move the remainder of the aggregated transactions into the difference account',
						input: {
							type: 'BOOLEAN_INPUT_PROPS_TYPE',
							title: 'Toggle Diff Account',
							value: config.diffTransaction !== undefined,
							validation: config.diffTransaction === undefined ? validationMap?.value : undefined,
							onChange: () => {
								if (config.diffTransaction === undefined) {
									const transactionId = diffValue < 0 ? template.autoDiffInId : template.autoDiffOutId;
									dispatch({
										type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DIFF_TRANSACTION,
										transaction: { transactionId, value: Math.abs(diffValue) },
									});
								} else {
									dispatch({ type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DIFF_TRANSACTION });
								}
							},
						},
				  }
				: undefined,
		cancel: {
			type: 'BUTTON_PROPS_TYPE',
			title: 'Cancel',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
					templateId: config.templateId,
				});
			},
		},
		submit:
			validationMap === undefined
				? needsDateOverrideConfirmation
					? {
							type: 'BUTTON_PROPS_TYPE',
							title: 'Submit',
							onSelect: () => {
								req.openDateOverrideConfirmationModal();
							},
					  }
					: {
							type: 'BUTTON_PROPS_TYPE',
							title: 'Submit',
							onSelect: () => {
								dispatch({
									type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
									templateId: config.templateId,
								});
								dispatch({
									type: ApplicationActionType.ROUTER_GO_TO,
									path: ROUTES_BOOK_ENTRIES,
								});
							},
					  }
				: {
						type: 'BUTTON_PROPS_TYPE',
						title: 'Validate',
						onSelect: () => {
							req.setShowValidation();
						},
				  },
	};
};

export const toOverrideDateConfirmationModalViewProps = (
	appState: ApplicationState,
	closeModal: () => void
): OverrideDateConfirmationModalViewProps | undefined => {
	const selectedTemplateId = appState.bookEntries.create.selectedTemplateId;
	const config = appState.bookEntries.create.templates[selectedTemplateId || ''];
	if (config === undefined) return undefined;
	const dateDisplay = DateWithoutTime.fromString(config.date).toLocaleDateString('de-DE', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	return {
		title: 'Date already exists!',
		message: `Do you really want to override this date?(${dateDisplay})`,
		cancel: {
			type: 'BUTTON_PROPS_TYPE',
			title: 'No',
			onSelect: () => {
				closeModal();
			},
		},
		submit: {
			type: 'BUTTON_PROPS_TYPE',
			title: 'Yes',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
					templateId: config.templateId,
				});
				dispatch({
					type: ApplicationActionType.ROUTER_GO_TO,
					path: ROUTES_BOOK_ENTRIES,
				});
				closeModal();
			},
		},
	};
};

interface CreateBookEntryValidationMap {
	transactions?: {
		[transactionId: string]: string | undefined;
	};
	value?: string;
}

const validateCreateBookEntry = (appState: ApplicationState): CreateBookEntryValidationMap | undefined => {
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

const validateIfDateExists = (appState: ApplicationState): string | undefined => {
	const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.create.selectedTemplateId || ''];
	if (templateConfig === undefined) return undefined;
	return Object.keys(appState.bookEntries.entries).includes(templateConfig.date) ? 'Date already exists!' : undefined;
};

const validateTransactions = (
	appState: ApplicationState
): { [transactionId: string]: string | undefined } | undefined => {
	const selectedTemplateId = appState.bookEntries.create.selectedTemplateId;
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
	if (value === undefined) return 'Transaction is missing!';
	if (!/^\d+([.]\d{2})?$/.test(value)) return 'Value needs 2 decimals(format: 0.00)!';
	return undefined;
};

const validateTransactionValue = (appState: ApplicationState): string | undefined => {
	const selectedTemplateId = appState.bookEntries.create.selectedTemplateId;
	if (selectedTemplateId === undefined) return 'No Template selected!';
	const config = appState.bookEntries.create.templates[selectedTemplateId];
	if (config === undefined) return 'Found no config!';
	if (config.diffTransaction) return undefined;
	const cashierAccount =
		Object.values(appState.accounts.accounts).find(({ type }) => {
			return type === AccountType.CASH_STATION;
		}) || undefined;
	if (cashierAccount === undefined) return 'Cashier account is missing!';
	const differenceAccount =
		Object.values(appState.accounts.accounts).find(({ type }) => {
			return type === AccountType.DIFFERENCE;
		}) || undefined;
	if (differenceAccount === undefined) return 'Difference account is missing!';
	const value = transactionValue(appState);
	return value === 0 ? undefined : 'Transactions result to ' + value + '!';
};
