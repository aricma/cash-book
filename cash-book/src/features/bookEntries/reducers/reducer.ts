import { Reducer } from '../../../models/reducers';
import { BookEntriesState, initialState } from '../state';
import { BookEntriesAction, ApplicationActionType } from '../../../applicationState/actions';
import { compactObject } from '../../../models/utils';

export const makeReducer =
	(getDate: () => string): Reducer<BookEntriesState, BookEntriesAction> =>
	(state, action) => {
		switch (action.type) {
			case ApplicationActionType.BOOK_ENTRIES_SET:
				return {
					...state,
					templates: {
						...action.bookEntries,
					},
				};
			case ApplicationActionType.BOOK_ENTRIES_RESET:
				return {
					...initialState,
				};
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
									date: getDate(),
									cash: {
										start: '0.00',
										end: '0.00',
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
								date: getDate(),
								cash: {
									start: '0.00',
									end: '0.00',
								},
								transactions: {},
							},
						},
					},
				};
			case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START: {
				const template = state.create.templates[action.templateId];
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
				const template = state.create.templates[action.templateId];
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
			case ApplicationActionType.BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION: {
				const template = state.create.templates[action.templateId];
				return {
					...state,
					create: {
						...state.create,
						templates: {
							...state.create.templates,
							[template.templateId]: {
								...template,
								diffTransaction: { transactionId: action.transactionId, value: action.value },
							},
						},
					},
				};
			}
			case ApplicationActionType.BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION: {
				const template = state.create.templates[action.templateId];
				return {
					...state,
					create: {
						...state.create,
						templates: {
							...state.create.templates,
							[template.templateId]: {
								...template,
								diffTransaction: undefined,
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
				const template = state.create.templates[action.templateId];
				return {
					...state,
					create: {
						...state.create,
						templates: {
							...state.create.templates,
							[action.templateId]: {
								...state.create.templates[action.templateId],
								transactions: {
									...template.transactions,
									[action.transactionId]: action.value,
								},
							},
						},
					},
				};
			case ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT: {
				const config = state.create.templates[action.templateId];
				return {
					...state,
					create: {
						templates: compactObject({
							...state.create.templates,
							[action.templateId]: {
								...state.create.templates[action.templateId],
								diffTransaction: undefined,
								cash: {
									start: '0.00',
									end: '0.00',
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
									[config.diffTransaction?.transactionId || 'will-be-removed']:
										config.diffTransaction?.value.toString(),
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
