import * as redux from 'redux';
import { ApplicationAction } from './actions';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './rootReducer';
import { useSelector } from 'react-redux';
import { rootSaga } from '../sideEffects';
import { IS_DEVELOPMENT_ENVIRONMENT } from '../variables/environments';

const sagaMiddleware = createSagaMiddleware();

export const store = redux.createStore(
	rootReducer,
	undefined,
	IS_DEVELOPMENT_ENVIRONMENT
		? composeWithDevTools(redux.applyMiddleware(sagaMiddleware))
		: redux.applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export type ApplicationState = ReturnType<typeof rootReducer>;
export type Dispatch = (action: ApplicationAction) => void;
export const dispatch: Dispatch = (action) => store.dispatch(action);
export const useAppState = <T>(selector: (state: ApplicationState) => T) => useSelector<ApplicationState, T>(selector);
export const selectAppState = (state: ApplicationState): ApplicationState => state;
