import createSagaMiddleware from 'redux-saga';
import * as redux from 'redux';
import { rootReducer } from './rootReducer';
import { IS_DEVELOPMENT_ENVIRONMENT } from '../variables/environments';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootSaga } from '../sideEffects';
import { Dispatch } from './index';

const sagaMiddleware = createSagaMiddleware();

export const store = redux.createStore(
	rootReducer,
	undefined,
	IS_DEVELOPMENT_ENVIRONMENT
		? composeWithDevTools(redux.applyMiddleware(sagaMiddleware))
		: redux.applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export const dispatch: Dispatch = (action) => store.dispatch(action);
