import * as SE from 'redux-saga/effects';
import {makeBackupWorker} from './makeBackupWorker';
import {makeLoadBackupWorker} from './makeLoadBackupWorker';
import {makeReset} from './makeReset';
import {makeSaveAppStateToLocalStorage} from './makeSaveAppStateToLocalStorage';
import {makeLoadAppStateFromLocalStorage} from './makeLoadAppStateFromLocalStorage';
import {makeAccountsImport} from './makeAccountsImport';
import {makeAccountsExport} from './makeAccountsExport';
import {makeBookEntriesExportDay} from './makeBookEntriesExportDay';
import {makeBookEntriesExportMonth} from './makeBookEntriesExportMonth';
import {loadFromLocalStorage, setInLocalStorage} from './utils';


export function* applicationBroker() {
	yield SE.spawn(makeBackupWorker());
	yield SE.spawn(makeLoadBackupWorker(setInLocalStorage));
	yield SE.spawn(makeReset(setInLocalStorage));
	yield SE.spawn(makeSaveAppStateToLocalStorage(setInLocalStorage));
	yield SE.spawn(makeLoadAppStateFromLocalStorage(loadFromLocalStorage));
	yield SE.spawn(makeAccountsImport());
	yield SE.spawn(makeAccountsExport());
	yield SE.spawn(makeBookEntriesExportDay());
	yield SE.spawn(makeBookEntriesExportMonth());
}
