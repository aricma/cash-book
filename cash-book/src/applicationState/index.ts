import { ApplicationAction } from './actions';
import { ApplicationState } from './state';
import { useSelector } from 'react-redux';

export type { ApplicationState };
export type Dispatch = (action: ApplicationAction) => void;
export const useAppState = <T>(selector: (state: ApplicationState) => T) => useSelector<ApplicationState, T>(selector);
export const selectAppState = (state: ApplicationState): ApplicationState => state;
