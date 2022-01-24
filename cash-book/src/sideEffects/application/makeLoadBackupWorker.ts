import { LoadBackup, ApplicationActionType } from '../../applicationState/actions';
import * as SE from 'redux-saga/effects';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeLoadBackupWorker = (setInLocalStorage: (key: string, value: string) => void) => {
	return function* worker() {
		while (true) {
			try {
				const action: LoadBackup = yield SE.take(ApplicationActionType.APPLICATION_BACKUP_LOAD);
				const text: string = yield SE.call(() => action.file.text());
				const noUserConsent = !window.confirm(
					'Do you really want to load this backup? This action will overwrite your current state of the app! This action can not be undone!'
				);
				if (noUserConsent) continue;
				setInLocalStorage(LOCAL_STORAGE_KEY, text);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
				});
			} catch (e) {
				console.log(e);
			}
		}
	};
};
