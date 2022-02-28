import * as SE from 'redux-saga/effects';
import { ExportFileConfig, makeExportToFile } from './makeExportToFile';
import { makeLoadBackupWorker } from './makeLoadBackupWorker';
import { makeResetWorker } from './makeResetWorker';
import { makeSaveBackupToLocalStorage } from './makeSaveBackupToLocalStorage';
import { makeLoadBackupFromLocalStorageWorker } from './makeLoadBackupFromLocalStorageWorker';
import { makeExports } from './makeExports';
import { exportToFile, loadFromLocalStorage, setInLocalStorage, removeFromLocalStorage } from '../../misc/utils';
import { channel } from 'redux-saga';
import { toExportFileConfig } from './toExportFileConfig';
import { backupValidation } from '../../backupValidation';
import { migrateBackup } from '../../backupMigrations';
import { makeUniqueID } from '../../misc/makeUniqueID';
import { toBackup } from '../../misc/toBackup';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

const exportFilesQueue = channel<ExportFileConfig>();

export function* applicationBroker() {
	yield SE.spawn(
		makeExports({
			exportFilesQueue: exportFilesQueue,
			makeUniqueID: makeUniqueID,
			toExportFileConfig: toExportFileConfig,
		})
	);
	yield SE.spawn(
		makeExportToFile({
			exportFilesQueue: exportFilesQueue,
			exportToFile: exportToFile,
		})
	);
	yield SE.spawn(
		makeLoadBackupWorker(setInLocalStorage, () =>
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
