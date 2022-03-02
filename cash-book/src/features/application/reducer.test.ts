import { ApplicationActionType, DefaultSet, LoadingSet, ErrorSet } from '../../applicationState/actions';
import { makeReducerExpectation, makeDefaultReducerTest } from '../../misc/tests';
import { reducer } from './reducer';
import { initialState, GlobalStateType } from './state';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

const expectation = makeReducerExpectation(reducer);

makeDefaultReducerTest(reducer, initialState);

describe(ApplicationActionType.APPLICATION_DEFAULT_SET, () => {
	test('given loading state, when called, then returns expected state', () => {
		expectation<DefaultSet>({
			state: {
				type: GlobalStateType.LOADING,
			},
			action: {
				type: ApplicationActionType.APPLICATION_DEFAULT_SET,
			},
			expectedState: {
				type: GlobalStateType.DEFAULT,
			},
		});
	});
});

describe(ApplicationActionType.APPLICATION_LOADING_SET, () => {
	test('given default state, when called, then returns expected state', () => {
		expectation<LoadingSet>({
			state: {
				type: GlobalStateType.DEFAULT,
			},
			action: {
				type: ApplicationActionType.APPLICATION_LOADING_SET,
			},
			expectedState: {
				type: GlobalStateType.LOADING,
			},
		});
	});
});

describe(ApplicationActionType.APPLICATION_ERROR_SET, () => {
	test('given default state, when called, then returns expected state', () => {
		expectation<ErrorSet>({
			state: {
				type: GlobalStateType.DEFAULT,
			},
			action: {
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: new CashBookError(CashBookErrorType.UNKNOWN, Error('ANY')),
			},
			expectedState: {
				type: GlobalStateType.ERROR,
				error: new CashBookError(CashBookErrorType.UNKNOWN, Error('ANY')),
			},
		});
	});
});
