import { makeResetWorker, initialAppState } from './makeResetWorker';
import { expectSaga } from 'redux-saga-test-plan';
import { ApplicationActionType } from '../../applicationState/actions';
import { LOCAL_STORAGE_KEY } from '../../variables/environments';

const setLocalStorage = jest.fn();
const getUserConsent = jest.fn();

beforeEach(() => {
	setLocalStorage.mockReset();
	getUserConsent.mockReset();
});

describe(makeResetWorker.name, () => {
	test('given user consent, when called, then sets local storage with initial app state', async () => {
		getUserConsent.mockReturnValue(true);
		await expectSaga(makeResetWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_RESET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_LOAD,
			})
			.run({ silenceTimeout: true });
		expect(setLocalStorage).toBeCalledWith(LOCAL_STORAGE_KEY, JSON.stringify(initialAppState));
	});

	test('given no consent by user, when called, then continues', async () => {
		getUserConsent.mockReturnValue(false);
		await expectSaga(makeResetWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_RESET,
			})
			.run({ silenceTimeout: true });
		expect(setLocalStorage).not.toBeCalled();
	});

	test('given some error, when called, then sets application error in state', async () => {
		getUserConsent.mockReturnValue(true);
		setLocalStorage.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(makeResetWorker(setLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_RESET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});
});
