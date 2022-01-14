import * as SE from 'redux-saga/effects';
import {history} from '../router';
import {makeGoToWorker} from './router';
import {makeSaveAppStateToLocalStorage, makeLoadAppStateFromLocalStorage} from './application';
import {makeBookEntriesExportDay, makeBookEntriesExportMonth} from './browser';


export function* rootSaga() {
    yield SE.spawn(makeGoToWorker(history.push));
    yield SE.spawn(makeSaveAppStateToLocalStorage(setInLocalStorage));
    yield SE.spawn(makeLoadAppStateFromLocalStorage(loadFromLocalStorage));
    yield SE.spawn(makeBookEntriesExportDay());
    yield SE.spawn(makeBookEntriesExportMonth());
}

const setInLocalStorage = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
};
const loadFromLocalStorage = (key: string) => {
    return window.localStorage.getItem(key) || undefined
};
