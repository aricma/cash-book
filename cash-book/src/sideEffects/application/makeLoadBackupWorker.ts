import { LoadBackup, ApplicationActionType } from '../../applicationState/actions';
import * as SE from 'redux-saga/effects';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeLoadBackupWorker = (
	setInLocalStorage: (key: string, value: string) => void,
	getUserConsent: () => boolean
) => {
	return function* worker() {
		while (true) {
			try {
				const action: LoadBackup = yield SE.take(ApplicationActionType.APPLICATION_BACKUP_LOAD);
				const text: string = yield SE.call(() => action.file.text());
				if (!getUserConsent()) continue;
				setInLocalStorage(LOCAL_STORAGE_KEY, text);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
				});
			} catch (error) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: error,
				});
			}
		}
	};
};
