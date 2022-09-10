import * as SE from 'redux-saga/effects';
import { makeGoToWorker, makeFallbackWorker } from './router';
import { history } from '../../router';
import { scrollToTheTop } from '../../misc/utils';

export function* routerBroker() {
	yield SE.spawn(makeGoToWorker({ goTo: history.push, goToExternal, scrollToTheTop }));
	yield SE.spawn(makeFallbackWorker());
}

export const goToExternal = (path: string) => window.open(path, '_blank');
