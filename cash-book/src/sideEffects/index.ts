import * as SE from 'redux-saga/effects';
import {routerBroker} from './router';
import {applicationBroker} from './application';
import {makeEditBookEntryWorker} from './bookEntries';


export function* rootSaga() {
    yield SE.spawn(routerBroker);
    yield SE.spawn(applicationBroker);
    yield SE.spawn(makeEditBookEntryWorker());
}
