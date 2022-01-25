import { Reducer } from '../../models/reducers';
import { GlobalState, GlobalStateType } from './state';
import { ApplicationActionType, Misc } from '../../applicationState/actions';

export const reducer: Reducer<GlobalState, Misc> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.APPLICATION_DEFAULT_SET:
			return {
				...state,
				type: GlobalStateType.DEFAULT,
			};
		case ApplicationActionType.APPLICATION_LOADING_SET:
			return {
				...state,
				type: GlobalStateType.LOADING,
			};
		case ApplicationActionType.APPLICATION_ERROR_SET:
			return {
				...state,
				type: GlobalStateType.ERROR,
				error: action.error,
			};
		default:
			return state;
	}
};
