import * as SE from 'redux-saga/effects';
import { Channel } from 'redux-saga';
import { ApplicationActionType } from '../../applicationState/actions';

export enum FileType {
	DATEV = 'FILE_TYPE/DATEV',
	CSV = 'FILE_TYPE/CSV',
	JSON = 'FILE_TYPE/JSON',
}

export interface ExportFileConfig {
	name: string;
	content: string;
}

interface Request {
	exportFilesQueue: Channel<ExportFileConfig>;
	exportToFile: (content: string, name: string) => void;
}

export const makeExportToFile = (req: Request) => {
	return function* worker() {
		while (true) {
			try {
				const action: ExportFileConfig = yield SE.take(req.exportFilesQueue);
				req.exportToFile(action.content, action.name);
			} catch (error) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: error,
				});
			}
		}
	};
};
