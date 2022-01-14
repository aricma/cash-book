import { Reducer } from '../../models/reducers';
import { BookEntriesState } from './state';
import {
	BookingsAction,
	ApplicationActionType,
} from '../../applicationState/actions';
import { toNumber } from '../../models/utils';
import { DateWithoutTime } from '../../models/domain/date';

export const reducer: Reducer<BookEntriesState, BookingsAction> = (
	state,
	action
) => {
	switch (action.type) {
		case ApplicationActionType.BOOK_ENTRIES_SET:
			return action.state;
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE:
			return {
				...state,
				create: {
					...state.create,
					date: action.date,
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION:
			return {
				...state,
				create: {
					...state.create,
					transactions: {
						...state.create.transactions,
						[action.transactionId]: action.value,
					},
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL:
			return {
				...state,
				create: {
					cash: {},
					transactions: {},
				},
			};
		case ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT:
			if (state.create.date === undefined) return state;
			// if (state.create.cash.start === undefined) return state;
			// if (state.create.cash.end === undefined) return state;
			const cashStart = 0; // toNumber(state.create.cash.start);
			const cashEnd = 0; // toNumber(state.create.cash.end);
			// if (cashStart === undefined) return state;
			// if (cashEnd === undefined) return state;
			const date = DateWithoutTime.fromString(state.create.date).toISOString();
			const transactions = Object.fromEntries(
				Object.entries(state.create.transactions).map(([id, value]) => {
					return [id, toNumber(value) || 0];
				})
			);
			return {
				...state,
				create: {
					cash: {},
					transactions: {},
				},
				entries: {
					...state.entries,
					[date]: {
						date: date,
						cash: {
							start: cashStart,
							end: cashEnd,
						},
						transactions: transactions,
					},
				},
			};
		default:
			return state;
	}
};
