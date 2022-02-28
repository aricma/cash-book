import { SettingsSaveType, initialState } from './state';
import { ApplicationActionType, SettingsSet } from '../../applicationState/actions';
import { makeReducerExpectation, makeDefaultReducerTest } from '../../misc/tests';
import { reducer } from './reducer';

const expectation = makeReducerExpectation(reducer);

makeDefaultReducerTest(reducer, initialState);

describe(ApplicationActionType.SETTINGS_SET, () => {
	test('when called, then returns expected', () => {
		expectation<SettingsSet>({
			state: {
				save: SettingsSaveType.AUTO,
			},
			action: {
				type: ApplicationActionType.SETTINGS_SET,
				state: {
					save: SettingsSaveType.MANUAL,
				},
			},
			expectedState: {
				save: SettingsSaveType.MANUAL,
			},
		});
	});
});

describe(ApplicationActionType.SETTINGS_RESET, () => {
	test('when called, then returns expected', () => {
		expectation({
			state: {
				save: SettingsSaveType.MANUAL,
			},
			action: {
				type: ApplicationActionType.SETTINGS_RESET,
			},
			expectedState: {
				save: SettingsSaveType.AUTO,
			},
		});
	});
});
