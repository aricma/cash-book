import * as SE from 'redux-saga/effects';
import { LoadBackup, ApplicationActionType } from '../../applicationState/actions';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

export const makeUploadBackupWorker = (
	setInLocalStorage: (key: string, value: string) => void,
	getUserConsent: () => boolean
) => {
	return function* worker() {
		while (true) {
			try {
				const action: LoadBackup = yield SE.take(ApplicationActionType.APPLICATION_BACKUP_UPLOAD);
				const text: string = yield SE.call(() => action.file.text());
				if (!getUserConsent()) continue;
				setInLocalStorage(LOCAL_STORAGE_KEY, text);
				yield SE.put({
					type: ApplicationActionType.APPLICATION_LOAD,
				});
			} catch (error: any) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: new CashBookError(CashBookErrorType.FAILED_TO_UPLOAD_BACKUP, error),
				});
			}
		}
	};
};
