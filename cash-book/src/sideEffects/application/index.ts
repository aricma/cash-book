import * as SE from 'redux-saga/effects';
import { WriteToFileConfig, makeWriteToFile } from './makeWriteToFile';
import { makeUploadBackupWorker } from './makeUploadBackupWorker';
import { makeResetWorker } from './makeResetWorker';
import { makeSaveBackupToLocalStorage } from './makeSaveBackupToLocalStorage';
import { makeLoadBackupFromLocalStorageWorker } from './makeLoadBackupFromLocalStorageWorker';
import { makeExportsWorker } from './makeExportsWorker';
import { exportToFile, loadFromLocalStorage, setInLocalStorage, removeFromLocalStorage } from '../../misc/utils';
import { channel } from 'redux-saga';
import { toWriteToFileConfig } from './toWriteToFileConfig';
import { backupValidation } from '../../backupValidation';
import { migrateBackup } from '../../backupMigrations';
import { makeUniqueID } from '../../misc/makeUniqueID';
import { toBackup } from '../../misc/toBackup';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

const writeToFilesQueue = channel<WriteToFileConfig>();

export function* applicationBroker() {
	yield SE.spawn(
		makeExportsWorker({
			exportFilesQueue: writeToFilesQueue,
			makeUniqueID: makeUniqueID,
			toExportFileConfig: toWriteToFileConfig,
		})
	);
	yield SE.spawn(
		makeWriteToFile({
			writeToFilesQueue: writeToFilesQueue,
			writeToFile: exportToFile,
		})
	);
	yield SE.spawn(
		makeUploadBackupWorker(setInLocalStorage, () =>
			window.confirm(
				'Do you really want to load this backup? This action will overwrite your current state of the app! This action can not be undone!'
			)
		)
	);
	yield SE.spawn(
		makeResetWorker(
			() => removeFromLocalStorage(LOCAL_STORAGE_KEY),
			() =>
				window.confirm(
					'Do you really want to reset your app? Everything will be deleted! This action can not be undone!'
				)
		)
	);
	yield SE.spawn(makeSaveBackupToLocalStorage(setInLocalStorage, toBackup));
	yield SE.spawn(
		makeLoadBackupFromLocalStorageWorker({
			getFromLocalStorage: loadFromLocalStorage,
			parseJSON: JSON.parse,
			migrateBackup: migrateBackup,
			backupValidation: backupValidation,
		})
	);
}
