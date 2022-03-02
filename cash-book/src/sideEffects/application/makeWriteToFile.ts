import * as SE from 'redux-saga/effects';
import { Channel } from 'redux-saga';
import { ApplicationActionType } from '../../applicationState/actions';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

export enum FileType {
	DATEV = 'FILE_TYPE/DATEV',
	CSV = 'FILE_TYPE/CSV',
	JSON = 'FILE_TYPE/JSON',
}

export interface WriteToFileConfig {
	name: string;
	content: string;
}

interface Request {
	writeToFilesQueue: Channel<WriteToFileConfig>;
	writeToFile: (content: string, name: string) => void;
}

export const makeWriteToFile = (req: Request) => {
	return function* worker() {
		while (true) {
			try {
				const action: WriteToFileConfig = yield SE.take(req.writeToFilesQueue);
				req.writeToFile(action.content, action.name);
			} catch (error: any) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: new CashBookError(CashBookErrorType.FAILED_TO_WRITE_TO_FILE, error),
				});
			}
		}
	};
};
