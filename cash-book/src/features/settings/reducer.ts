import {Reducer} from '../../models/reducers';
import {SettingsState} from './state';
import {ApplicationActionType, SettingsAction} from '../../applicationState/actions';


export const reducer: Reducer<SettingsState, SettingsAction> = (state, action) => {
    switch (action.type) {
        case ApplicationActionType.SETTINGS_SET:
            return action.state;
        default:
            return state;
    }
};
