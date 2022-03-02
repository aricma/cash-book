import * as SE from 'redux-saga/effects';
import { ApplicationActionType, Export } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { Channel } from 'redux-saga';
import { WriteToFileConfig } from './makeWriteToFile';
import { ToExportFileConfig } from './toWriteToFileConfig';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

interface Request {
	exportFilesQueue: Channel<WriteToFileConfig>;
	makeUniqueID: () => string;
	toExportFileConfig: ToExportFileConfig;
}

export const makeExportsWorker = (req: Request) => {
	return function* worker() {
		while (true) {
			try {
				const action: Export = yield SE.take(ApplicationActionType.APPLICATION_EXPORT);
				const appState: ApplicationState = yield SE.select(selectAppState);
				const exportFileConfig = req.toExportFileConfig({
					appState: appState,
					unique: req.makeUniqueID(),
					action: action,
				});
				if (exportFileConfig === null) continue;
				req.exportFilesQueue.put(exportFileConfig);
			} catch (error: any) {
				yield SE.put({
					type: ApplicationActionType.APPLICATION_ERROR_SET,
					error: new CashBookError(CashBookErrorType.FAILED_TO_EXPORT, error),
				});
			}
		}
	};
};
