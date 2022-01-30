import * as SE from 'redux-saga/effects';
import { makeLoadBackupWorker } from './makeLoadBackupWorker';
import { makeReset } from './makeReset';
import { makeSaveAppStateToLocalStorage } from './makeSaveAppStateToLocalStorage';
import { makeLoadAppStateFromLocalStorage } from './makeLoadAppStateFromLocalStorage';
import { makeAccountsImport } from './makeAccountsImport';
import { makeExports } from './makeExports';
import { loadFromLocalStorage, setInLocalStorage } from './utils';
import { channel } from 'redux-saga';
import { makeExportToFile, ExportFileConfig } from './makeExportToFile';

const exportFilesQueue = channel<ExportFileConfig>();

export function* applicationBroker() {
	yield SE.spawn(makeExports(exportFilesQueue));
	yield SE.spawn(makeExportToFile(exportFilesQueue));
	yield SE.spawn(makeLoadBackupWorker(setInLocalStorage));
	yield SE.spawn(makeReset(setInLocalStorage));
	yield SE.spawn(makeSaveAppStateToLocalStorage(setInLocalStorage));
	yield SE.spawn(makeLoadAppStateFromLocalStorage(loadFromLocalStorage));
	yield SE.spawn(makeAccountsImport());
}
