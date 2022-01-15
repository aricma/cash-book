import * as SE from 'redux-saga/effects';
import {BrowserLocalStorageSet, ApplicationActionType} from '../applicationState/actions';


export const makeRemoveFromLocalStorage = (
	removeFromLocalStorage: (id: string) => void
) => {
	return function* worker() {
		while (true) {
			try {
				const action: BrowserLocalStorageSet = yield SE.take(
					ApplicationActionType.BROWSER_LOCAL_STORAGE_REMOVE
				);
				removeFromLocalStorage(action.id);
			} catch (_) {}
		}
	};
};

