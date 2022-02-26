import { toReduxReducer } from '../models/reducers';
import { combineReducers } from 'redux';
import * as MiscState from '../features/application/state';
import * as MiscReducer from '../features/application/reducer';
import * as SettingsState from '../features/settings/state';
import * as SettingsReducer from '../features/settings/reducer';
import * as BookingsState from '../features/bookEntries/state';
import * as BookingsReducer from '../features/bookEntries/reducers';
import * as AccountsState from '../features/accounts/state';
import * as AccountsReducer from '../features/accounts/reducers';
import * as TransactionsState from '../features/transactions/state';
import * as TransactionsReducer from '../features/transactions/reducers';

export const rootReducer = combineReducers({
	global: toReduxReducer(MiscReducer.reducer, MiscState.initialState),
	settings: toReduxReducer(SettingsReducer.reducer, SettingsState.initialState),
	bookEntries: toReduxReducer(BookingsReducer.reducer, BookingsState.initialState),
	accounts: toReduxReducer(AccountsReducer.reducer, AccountsState.initialState),
	transactions: toReduxReducer(TransactionsReducer.reducer, TransactionsState.initialState),
});
