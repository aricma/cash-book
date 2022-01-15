import { toReduxReducer } from '../models/reducers';
import { combineReducers } from 'redux';
import * as SettingsState from '../features/settings/state';
import * as SettingsReducer from '../features/settings/reducer';
import * as BookingsState from '../features/bookEntries/state';
import * as BookingsReducer from '../features/bookEntries/reducer';
import * as AccountsState from '../features/accounts/state';
import * as AccountsReducer from '../features/accounts/reducer';
import * as TransactionsState from '../features/transactions/state';
import * as TransactionsReducer from '../features/transactions/reducer';

export const rootReducer = combineReducers({
	settings: toReduxReducer(SettingsReducer.reducer, SettingsState.initialState),
	bookEntries: toReduxReducer(BookingsReducer.reducer, BookingsState.initialState),
	accounts: toReduxReducer(AccountsReducer.reducer, AccountsState.initialState),
	transactions: toReduxReducer(TransactionsReducer.reducer, TransactionsState.initialState),
});
