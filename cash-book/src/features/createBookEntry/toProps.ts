import { AccountType } from '../accounts/state';
import { ApplicationActionType } from '../../applicationState/actions';
import {
	CreateBookEntryViewProps,
	OverrideDateConfirmationModalViewProps,
} from './props';
import { ApplicationState, dispatch } from '../../applicationState';
import { DateWithoutTime } from '../../models/domain/date';
import { compact, toNumber, subtractDays } from '../../models/utils';

export const toCreateBookEntryViewProps = (
	appState: ApplicationState,
	showValidation: boolean,
	setShowValidation: () => void,
	openDateOverrideConfirmationModal: () => void
): CreateBookEntryViewProps => {
	const validationMap = validateCreateBookEntry(appState);
	const needsDateOverrideConfirmation =
		validateIfDateExists(appState) !== undefined;
	const dateDisplay =
		appState.bookEntries.create.date === undefined
			? undefined
			: DateWithoutTime.fromString(
					appState.bookEntries.create.date
			  ).toLocaleDateString('de-DE', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
			  });
	const dateValue =
		appState.bookEntries.create.date === undefined
			? ''
			: appState.bookEntries.create.date;
	return {
		title: 'New Book Entry',
		date: {
			input: {
				type: 'DATE_PICKER_INPUT_PROPS',
				label: dateDisplay,
				value: dateValue,
				onChange: (date) => {
					dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
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
						date: yesterday.toISOString(),
					});
				},
			},
		},
		inputs: Object.values(appState.transactions.transactions)
			.sort((a, b) => {
				return a.order - b.order;
			})
			.map((transaction) => {
				return {
					type: 'TEXT_INPUT_PROPS_TYPE',
					label: transaction.name,
					value: appState.bookEntries.create.transactions[transaction.id] || '',
					placeholder: '',
					validation: showValidation
						? validationMap?.transactions[transaction.id]
						: undefined,
					onChange: (value) => {
						if (/[\d.]*/.test(value)) {
							dispatch({
								type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
								transactionId: transaction.id,
								value: value,
							});
						}
					},
				};
			}),
		valueValidation: showValidation ? validationMap?.value : undefined,
		cancel: {
			type: 'BUTTON_PROPS_TYPE',
			title: 'Cancel',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
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
								openDateOverrideConfirmationModal();
							},
					  }
					: {
							type: 'BUTTON_PROPS_TYPE',
							title: 'Submit',
							onSelect: () => {
								dispatch({
									type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
								});
							},
					  }
				: {
						type: 'BUTTON_PROPS_TYPE',
						title: 'Validate',
						onSelect: () => {
							setShowValidation();
						},
				  },
	};
};

export const toOverrideDateConfirmationModalViewProps = (
	appState: ApplicationState,
	closeModal: () => void
): OverrideDateConfirmationModalViewProps => {
	const dateDisplay =
		appState.bookEntries.create.date === undefined
			? 'Found no date!'
			: DateWithoutTime.fromString(
					appState.bookEntries.create.date
			  ).toLocaleDateString('de-DE', {
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
				});
				closeModal();
			},
		},
	};
};

interface CreateBookEntryValidationMap {
	date?: string;
	transactions: {
		[transactionId: string]: string | undefined;
	};
	value?: string;
}
const validateCreateBookEntry = (
	appState: ApplicationState
): CreateBookEntryValidationMap | undefined => {
	const date = validateDate(appState);
	const transactions = validateTransactions(appState);
	const value = validateTransactionValue(appState);

	const hasDate = date === undefined;
	const hasAllTransactions = compact(Object.values(transactions)).length === 0;
	const isBalanced = value === undefined;
	if (hasDate && hasAllTransactions && isBalanced) return undefined;

	return {
		date: date,
		transactions: transactions,
		value: value,
	};
};

const validateIfDateExists = (
	appState: ApplicationState
): string | undefined => {
	if (appState.bookEntries.create.date === undefined) return undefined;
	return Object.keys(appState.bookEntries.entries).includes(
		appState.bookEntries.create.date
	)
		? 'Date already exists!'
		: undefined;
};

const validateDate = (appState: ApplicationState): string | undefined => {
	return appState.bookEntries.create.date === undefined
		? 'Date is missing!'
		: undefined;
};

const validateTransactions = (
	appState: ApplicationState
): { [transactionId: string]: string | undefined } => {
	const requiredTransactionIds = Object.keys(
		appState.transactions.transactions
	);
	return requiredTransactionIds.reduce((map, transactionId) => {
		const value = appState.bookEntries.create.transactions[transactionId];
		return {
			...map,
			[transactionId]: !!value ? undefined : 'Transaction is missing!',
		};
	}, {});
};

const validateTransactionValue = (
	appState: ApplicationState
): string | undefined => {
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

	const requiredTransactionIds = Object.keys(
		appState.transactions.transactions
	);
	const value = requiredTransactionIds.reduce((value, transactionId) => {
		const transaction = appState.transactions.transactions[transactionId];
		const transactionValue =
			toNumber(appState.bookEntries.create.transactions[transactionId]) || 0;
		if (transaction.fromAccountId === cashierAccount.id) {
			return value - transactionValue;
		} else {
			return value + transactionValue;
		}
	}, 0);
	return value === 0 ? undefined : 'Transactions result to ' + value + '!';
};
