import { ApplicationState, Dispatch } from '../../../applicationState';
import { CreateBookEntryTemplateConfigProps, ToggleDiffViewType } from '../props';
import { validateCreateBookEntry, validateIfDateExists } from './validation';
import { transactionValue } from '../../bookEntries/misc';
import { DateWithoutTime } from '../../../models/dateWithoutTime';
import { ApplicationActionType } from '../../../applicationState/actions';
import { subtractDays } from '../../../models/utils';
import { cashInformationParser, transactionParser } from '../../../misc/parser';
import { IconType } from '../../../models/props';
import { ROUTES_BOOK_ENTRIES } from '../../../variables/routes';

interface ToTemplateConfigPropsRequest {
	dispatch: Dispatch;
	appState: ApplicationState;
	showValidation: boolean;
	setShowValidation: () => void;
	openDateOverrideConfirmationModal: () => void;
}

export const toTemplateConfigProps = (req: ToTemplateConfigPropsRequest): CreateBookEntryTemplateConfigProps => {
	const selectedTemplateId = req.appState.bookEntries.selectedTemplateId || '';
	const config = req.appState.bookEntries.create.templates[selectedTemplateId];
	const template = req.appState.transactions.templates[selectedTemplateId];
	const validationMap = validateCreateBookEntry(req.appState);
	const diffValue = transactionValue(req.appState);
	const cashierAccount = req.appState.accounts.accounts[template.cashierAccountId];
	const diffAccount = req.appState.accounts.accounts[template.diffAccountId];
	const needsDateOverrideConfirmation = validateIfDateExists(req.appState.bookEntries) !== null;
	const dateDisplay = DateWithoutTime.fromString(config.date).toLocaleDateString('de-DE', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const textInputChangeHandler = (value: string): string | null => {
		if (/^$ | ^[^\d.,\b]*$/.test(value)) return null;
		return value;
	};
	return {
		date: {
			input: {
				type: 'DATE_PICKER_INPUT_PROPS',
				label: dateDisplay,
				value: config.date,
				onChange: (date) => {
					req.dispatch({
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
					req.dispatch({
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
					req.dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
						templateId: config.templateId,
						date: yesterday.toISOString(),
					});
				},
			},
		},
		cashStart: {
			type: 'TEXT_INPUT_PROPS_TYPE',
			label: 'Cash Station: Start Value',
			value: config.cash.start,
			placeholder: '',
			onFinish: (value) => {
				const newValue = cashInformationParser(value);
				if (newValue === value) return;
				req.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
					templateId: config.templateId,
					value: newValue,
				});
			},
			onChange: (value) => {
				const newValue = textInputChangeHandler(value);
				if (newValue === null) return;
				req.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
					templateId: config.templateId,
					value: newValue,
				});
			},
		},
		cashEnd: {
			type: 'TEXT_INPUT_PROPS_TYPE',
			label: 'Cash Station: End Value',
			value: config.cash.end,
			placeholder: '',
			onFinish: (value) => {
				const newValue = cashInformationParser(value);
				if (newValue === value) return;
				req.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
					templateId: config.templateId,
					value: newValue,
				});
			},
			onChange: (value) => {
				const newValue = textInputChangeHandler(value);
				if (newValue === null) return;
				req.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
					templateId: config.templateId,
					value: newValue,
				});
			},
		},
		transactions: template.transactionIds.map((transactionsId) => {
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
					const newValue = transactionParser(value);
					if (newValue === value) return;
					req.dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
						templateId: config.templateId,
						transactionId: transaction.id,
						value: newValue,
					});
				},
				onChange: (value) => {
					const newValue = textInputChangeHandler(value);
					if (newValue === null) return;
					req.dispatch({
						type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
						templateId: config.templateId,
						transactionId: transaction.id,
						value: newValue,
					});
				},
			};
		}),
		diffTransaction:
			diffValue !== 0
				? {
						type: (() => {
							const absoluteDiffValue = Math.abs(diffValue);
							switch (true) {
								case absoluteDiffValue <= 10:
									return ToggleDiffViewType.DEFAULT;
								case absoluteDiffValue <= 50:
									return ToggleDiffViewType.WARNING;
								case absoluteDiffValue > 50:
									return ToggleDiffViewType.DANGER;
								default:
									return ToggleDiffViewType.DEFAULT;
							}
						})(),
						title: 'Difference Transaction',
						cashierAccount: cashierAccount.name,
						direction: diffValue < 0 ? IconType.ARROW_NARROW_LEFT_STROKE : IconType.ARROW_NARROW_RIGHT_STROKE,
						diffAccount: diffAccount.name,
						value: transactionParser(String(Math.abs(diffValue))),
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
									req.dispatch({
										type: ApplicationActionType.BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION,
										templateId: template.id,
										transactionId: transactionId,
										value: transactionParser(String(Math.abs(diffValue))),
									});
								} else {
									req.dispatch({
										type: ApplicationActionType.BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION,
										templateId: template.id,
									});
								}
							},
						},
				  }
				: undefined,
		cancel: {
			type: 'BUTTON_PROPS_TYPE',
			title: 'Cancel',
			onSelect: () => {
				req.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
					templateId: config.templateId,
				});
			},
		},
		submit:
			validationMap === null
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
								req.dispatch({
									type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
									templateId: config.templateId,
								});
								req.dispatch({
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
