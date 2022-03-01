import * as SE from 'redux-saga/effects';
import {ApplicationActionType, BookEntriesEdit} from '../../applicationState/actions';
import {ApplicationState, selectAppState} from '../../applicationState';
import {TransactionType} from '../../features/transactions/state';
import {CreateBookEntry} from '../../features/bookEntries/state';


export const makeEditBookEntryWorker = (reducer: EditBookEntryReducer) => {
    return function* worker() {
        while (true) {
            try {
                const action: BookEntriesEdit = yield SE.take(ApplicationActionType.BOOK_ENTRIES_EDIT);
                const appState: ApplicationState = yield SE.select(selectAppState);
                yield SE.put({
                    type: ApplicationActionType.BOOK_ENTRIES_EDIT_SET,
                    state: reducer(appState, action),
                });
            } catch (error) {
                yield SE.put({
                    type: ApplicationActionType.APPLICATION_ERROR_SET,
                    error: error,
                });
            }
        }
    };
};

type EditBookEntryReducer = (state: ApplicationState, action: BookEntriesEdit) => CreateBookEntry;
export const editBookEntryReducer: EditBookEntryReducer = (state, action) => {
    const entries = state.bookEntries.templates[action.templateId];
    const bookEntry = entries[action.date];
    return {
        date: bookEntry.date,
        templateId: bookEntry.templateId,
        cash: {
            start: bookEntry.cash.start,
            end: bookEntry.cash.end,
        },
        transactions: {
            ...Object.fromEntries(
                Object.entries(bookEntry.transactions).filter(([transactionId, _]) => {
                    const transaction = state.transactions.transactions[transactionId];
                    switch (transaction.type) {
                        case TransactionType.SYS_OUT:
                        case TransactionType.SYS_IN:
                            return false;
                        default:
                            return true;
                    }
                }),
            ),
        },

    };
};
