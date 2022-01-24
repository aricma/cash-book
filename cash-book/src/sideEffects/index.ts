import * as SE from 'redux-saga/effects';
import {history} from '../router';
import {makeGoToWorker} from './router';
import {applicationBroker} from './application';
import {makeEditBookEntryWorker} from './bookEntries';


export function* rootSaga() {
	yield SE.spawn(makeGoToWorker(history.push));
	yield SE.spawn(applicationBroker);
	yield SE.spawn(makeEditBookEntryWorker());
}
