import { Reducer } from '../../models/reducers';
import { GlobalState, GlobalStateType } from './state';
import { ApplicationActionType, Misc } from '../../applicationState/actions';

export const reducer: Reducer<GlobalState, Misc> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.APPLICATION_LOADING:
			return {
				...state,
				type: GlobalStateType.LOADING,
			};
		case ApplicationActionType.APPLICATION_DEFAULT:
			return {
				...state,
				type: GlobalStateType.DEFAULT,
			};
		default:
			return state;
	}
};
