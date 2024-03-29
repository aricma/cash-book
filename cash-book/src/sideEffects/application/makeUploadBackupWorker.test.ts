import { ApplicationActionType } from '../../applicationState/actions';
import { expectSaga } from 'redux-saga-test-plan';
import { makeUploadBackupWorker } from './makeUploadBackupWorker';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

const setLocalStorage = jest.fn();
const getUserConsent = jest.fn();

beforeEach(() => {
	setLocalStorage.mockReset();
	getUserConsent.mockReset();
});

describe(makeUploadBackupWorker.name, () => {
	const fileContent = 'abc';
	const file = {
		text: async () => fileContent,
	};

	test('given user consent, when called, then sets local storage with given backup', async () => {
		getUserConsent.mockReturnValue(true);
		await expectSaga(makeUploadBackupWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_BACKUP_UPLOAD,
				file: file,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.run({ silenceTimeout: true });
		expect(setLocalStorage).toBeCalledWith(LOCAL_STORAGE_KEY, fileContent);
	});

	test('given no consent by user, when called, then continues', async () => {
		getUserConsent.mockReturnValue(false);
		await expectSaga(makeUploadBackupWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_BACKUP_UPLOAD,
				file: file,
			})
			.run({ silenceTimeout: true });
		expect(setLocalStorage).not.toBeCalled();
	});

	test('given some error, when called, then sets application error in state', async () => {
		getUserConsent.mockReturnValue(true);
		setLocalStorage.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(makeUploadBackupWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_BACKUP_UPLOAD,
				file: file,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: new CashBookError(CashBookErrorType.FAILED_TO_UPLOAD_BACKUP, Error('ANY')),
			})
			.run({ silenceTimeout: true });
	});
});
