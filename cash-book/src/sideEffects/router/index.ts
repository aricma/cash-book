import * as SE from 'redux-saga/effects';
import { makeGoToWorker, makeFallbackWorker } from './router';
import { history } from '../../router';

export function* routerBroker() {
	yield SE.spawn(makeGoToWorker(history.push, goToExternal));
	yield SE.spawn(makeFallbackWorker(history.push));
}

export const goToExternal = (path: string) => window.open(path, '_blank');
