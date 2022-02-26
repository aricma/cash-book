import * as SE from 'redux-saga/effects';
import { applicationBroker } from './application';
import { makeEditBookEntryWorker, editBookEntryReducer } from './bookEntries/makeEditBookEntryWorker';
import { routerBroker } from './router';

export function* rootSaga() {
	yield SE.spawn(routerBroker);
	yield SE.spawn(applicationBroker);
	yield SE.spawn(makeEditBookEntryWorker(editBookEntryReducer));
}
