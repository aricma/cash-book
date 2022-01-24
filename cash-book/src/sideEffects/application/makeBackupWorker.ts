import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { toJSONContent, exportToFile } from './utils';

export const makeBackupWorker = () => {
	return function* worker() {
		while (true) {
			try {
				yield SE.take(ApplicationActionType.APPLICATION_BACKUP);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const timestamp = new Date().toISOString();
				const fileName = `cash-book-backup-${timestamp}.json`;
				exportToFile(toJSONContent(appState), fileName);
			} catch (e) {
				console.log(e);
			}
		}
	};
};
