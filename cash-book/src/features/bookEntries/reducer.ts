import { Reducer } from '../../models/reducers';
import { BookEntriesState } from './state';
import { BookingsAction, ApplicationActionType } from '../../applicationState/actions';
import { DateWithoutTime } from '../../models/domain/date';
import { compactObject } from '../../models/utils';

export const reducer: Reducer<BookEntriesState, BookingsAction> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.BOOK_ENTRIES_SET:
			return action.state;
		case ApplicationActionType.BOOK_ENTRIES_EDIT: {
			const entries = state.templates[action.templateId] || {};
			const bookEntry = entries[action.date];
			if (bookEntry === undefined) return state;
			return {
				...state,
				create: {
					...state.create,
					selectedTemplateId: action.templateId,
					templates: {
						...state.create.templates,
						[action.templateId]: {
							date: bookEntry.date,
							templateId: bookEntry.templateId,
							cash: {
								start: bookEntry.cash.start,
								end: bookEntry.cash.end,
							},
							transactions: {
								...bookEntry.transactions
							}
						}
					}
				}
			}
		}
		case ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE:
			return {
				...state,
				selectedTemplateId: action.templateId,
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE:
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
								start: "0",
								end: "0",
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
							}
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
							}
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
			const date = config.date;
			return {
				...state,
				create: {
					templates: compactObject({
						...state.create.templates,
						[action.templateId]: undefined,
					}),
				},
				templates: {
					...state.templates,
					[action.templateId]: {
						...(state.templates[action.templateId] || {}),
						[date]: {
							date: date,
							templateId: action.templateId,
							cash: {
								start: config.cash.start,
								end: config.cash.end,
							},
							transactions: compactObject({
								...config.transactions,
								[config.diffTransaction?.transactionId || '']: String(config.diffTransaction?.value),
							}),
						},
					}
				},
			};
		}
		default:
			return state;
	}
};
