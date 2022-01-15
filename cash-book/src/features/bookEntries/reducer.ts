import { Reducer } from '../../models/reducers';
import { BookEntriesState } from './state';
import { BookingsAction, ApplicationActionType } from '../../applicationState/actions';
import { toNumber, compactObject } from '../../models/utils';
import { DateWithoutTime } from '../../models/domain/date';

export const reducer: Reducer<BookEntriesState, BookingsAction> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.BOOK_ENTRIES_SET:
			return action.state;
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE:
			return {
				...state,
				create: {
					...state.create,
					selectedTemplateId: action.templateId,
					templates: {
						...state.create.templates,
						[action.templateId]: {
							templateId: action.templateId,
							date: DateWithoutTime.new().toISOString(),
							transactions: {},
						},
					},
				},
			};
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
		case ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL:
			return {
				...state,
				create: {
					...state.create,
					templates: compactObject({
						...state.create.templates,
						[action.templateId]: undefined,
					}),
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT:
			const template = state.create.templates[action.templateId];
			if (template.date === undefined) return state;
			const date = template.date;
			const transactions = Object.fromEntries(
				Object.entries(template.transactions).map(([id, value]) => {
					return [id, toNumber(value) || 0];
				})
			);
			return {
				...state,
				create: {
					...state.create,
					transactions: compactObject({
						...state.create.templates,
						[action.templateId]: undefined,
					}),
				},
				entries: {
					...state.entries,
					[date]: {
						date: date,
						transactions: transactions,
					},
				},
			};
		default:
			return state;
	}
};
