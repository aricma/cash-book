import * as SE from 'redux-saga/effects';
import { Channel } from 'redux-saga';
import { exportToFile } from './utils';

export enum FileType {
	DATEV = 'FILE_TYPE/DATEV',
	CSV = 'FILE_TYPE/CSV',
	JSON = 'FILE_TYPE/JSON',
}

export interface ExportFileConfig {
	name: string;
	content: string;
}

export const makeExportToFile = (exportFilesQueue: Channel<ExportFileConfig>) => {
	return function* worker() {
		while (true) {
			try {
				const action: ExportFileConfig = yield SE.take(exportFilesQueue);
				exportToFile(action.content, action.name);
			} catch (e) {
				// eslint-disable-next-line
				console.log(e);
			}
		}
	};
};
