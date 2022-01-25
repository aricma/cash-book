import { Reducer } from '../../models/reducers';
import { BookEntriesState } from './state';
import { BookingsAction, ApplicationActionType } from '../../applicationState/actions';
import { DateWithoutTime } from '../../models/domain/date';
import { compactObject } from '../../models/utils';

export const reducer: Reducer<BookEntriesState, BookingsAction> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.BOOK_ENTRIES_SET:
			return action.state;
		case ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE:
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE:
			const config = state.create.templates[action.templateId];
			if (config === undefined) {
				return {
					...state,
					selectedTemplateId: action.templateId,
					create: {
						...state.create,
						templates: {
							...state.create.templates,
							[action.templateId]: {
								templateId: action.templateId,
								date: DateWithoutTime.new().toISOString(),
								cash: {
									start: '0',
									end: '0',
								},
								transactions: {},
							},
						},
					},
				};
			} else {
				return {
					...state,
					selectedTemplateId: action.templateId,
				};
			}
		case ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL:
			return {
				...state,
				selectedTemplateId: action.templateId,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[action.templateId]: {
							templateId: action.templateId,
							date: DateWithoutTime.new().toISOString(),
							cash: {
								start: '0',
								end: '0',
							},
							transactions: {},
						},
					},
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START: {
			const template = state.create.templates[state.selectedTemplateId || ''];
			if (template === undefined) return state;
			return {
				...state,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[template.templateId]: {
							...template,
							cash: {
								...template.cash,
								start: action.value,
							},
						},
					},
				},
			};
		}
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END: {
			const template = state.create.templates[state.selectedTemplateId || ''];
			if (template === undefined) return state;
			return {
				...state,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[template.templateId]: {
							...template,
							cash: {
								...template.cash,
								end: action.value,
							},
						},
					},
				},
			};
		}
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DIFF_TRANSACTION: {
			const template = state.create.templates[state.selectedTemplateId || ''];
			if (template === undefined) return state;
			return {
				...state,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[template.templateId]: {
							...template,
							diffTransaction: action.transaction,
						},
					},
				},
			};
		}
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE:
			return {
				...state,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[action.templateId]: {
							...state.create.templates[action.templateId],
							date: action.date,
						},
					},
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION:
			return {
				...state,
				create: {
					...state.create,
					templates: {
						...state.create.templates,
						[action.templateId]: {
							...state.create.templates[action.templateId],
							transactions: {
								...(state.create.templates[action.templateId]?.transactions || {}),
								[action.transactionId]: action.value,
							},
						},
					},
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT: {
			const config = state.create.templates[action.templateId];
			if (config.date === undefined) return state;
			return {
				...state,
				create: {
					templates: compactObject({
						...state.create.templates,
						[action.templateId]: {
							...state.create.templates[action.templateId],
							diffTransaction: undefined,
							cash: {
								start: '0',
								end: '0',
							},
							transactions: {},
						},
					}),
				},
				templates: {
					...state.templates,
					[action.templateId]: {
						...(state.templates[action.templateId] || {}),
						[config.date]: {
							date: config.date,
							templateId: action.templateId,
							cash: {
								start: config.cash.start,
								end: config.cash.end,
							},
							transactions: compactObject({
								...Object.fromEntries(
									Object.entries(config.transactions).map(([key, value]) => [key, value === '' ? undefined : value])
								),
								[config.diffTransaction?.transactionId || '']: String(config.diffTransaction?.value),
							}),
						},
					},
				},
			};
		}
		default:
			return state;
	}
};
