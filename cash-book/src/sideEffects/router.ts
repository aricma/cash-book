import * as SE from 'redux-saga/effects';
import { ApplicationActionType, RouterGoTo } from '../applicationState/actions';

export const makeGoToWorker = (goTo: (path: string) => void) => {
	return function* worker() {
		while (true) {
			const action: RouterGoTo = yield SE.take(ApplicationActionType.ROUTER_GO_TO);
			goTo(action.path);
		}
	};
};
