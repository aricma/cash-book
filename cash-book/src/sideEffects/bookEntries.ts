import * as SE from 'redux-saga/effects';
import { ApplicationActionType, BookingsEdit } from '../applicationState/actions';
import { ApplicationState, selectAppState } from '../applicationState';
import { BookEntriesState } from '../features/bookEntries/state';
import { TransactionType } from '../features/transactions/state';

export const makeEditBookEntryWorker = () => {
	return function* worker() {
		while (true) {
			try {
				const action: BookingsEdit = yield SE.take(ApplicationActionType.BOOK_ENTRIES_EDIT);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const state = appState.bookEntries;
				const entries = state.templates[action.templateId];
				const bookEntry = entries[action.date];
				const newState: BookEntriesState = {
					...state,
					create: {
						...state.create,
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
									...Object.fromEntries(
										Object.entries(bookEntry.transactions).filter(([transactionId, _]) => {
											const transaction = appState.transactions.transactions[transactionId];
											switch (transaction.type) {
												case TransactionType.SYS_OUT:
												case TransactionType.SYS_IN:
													return false;
												default:
													return true;
											}
										})
									),
								},
							},
						},
					},
				};
				yield SE.put({
					type: ApplicationActionType.BOOK_ENTRIES_SET,
					state: newState,
				});
			} catch (e) {
				// eslint-disable-next-line
				console.log(e);
			}
		}
	};
};
