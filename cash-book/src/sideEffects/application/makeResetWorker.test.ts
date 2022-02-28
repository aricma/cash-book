import { makeResetWorker } from './makeResetWorker';
import { expectSaga } from 'redux-saga-test-plan';
import { ApplicationActionType } from '../../applicationState/actions';

const clearLocalStorage = jest.fn();
const getUserConsent = jest.fn();

beforeEach(() => {
	clearLocalStorage.mockReset();
	getUserConsent.mockReset();
});

describe(makeResetWorker.name, () => {
	test('given user consent, when called, then resets local storage', async () => {
		getUserConsent.mockReturnValue(true);
		await expectSaga(makeResetWorker(clearLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_RESET,
			})
			.put({
				type: ApplicationActionType.APPLICATION_DEFAULT_SET,
			})
			.put({
				type: ApplicationActionType.SETTINGS_RESET,
			})
			.put({
				type: ApplicationActionType.ACCOUNTS_RESET,
			})
			.put({
				type: ApplicationActionType.TRANSACTIONS_RESET,
			})
			.put({
				type: ApplicationActionType.BOOK_ENTRIES_RESET,
			})
			.put({
				type: ApplicationActionType.ROUTER_FALLBACK,
			})
			.run({ silenceTimeout: true });
		expect(clearLocalStorage).toBeCalled();
	});

	test('given no consent by user, when called, then continues', async () => {
		getUserConsent.mockReturnValue(false);
		await expectSaga(makeResetWorker(clearLocalStorage, getUserConsent))
			.dispatch({
				type: ApplicationActionType.APPLICATION_RESET,
			})
			.run({ silenceTimeout: true });
		expect(clearLocalStorage).not.toBeCalled();
	});

	test('given some error, when called, then sets application error in state', async () => {
		getUserConsent.mockReturnValue(true);
		clearLocalStorage.mockImplementation(() => {
			throw Error('ANY');
		});
		await expectSaga(makeResetWorker(clearLocalStorage, getUserConsent))
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
