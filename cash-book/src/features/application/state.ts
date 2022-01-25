export enum GlobalStateType {
	DEFAULT = 'GLOBAL_STATE_TYPE/DEFAULT',
	LOADING = 'GLOBAL_STATE_TYPE/LOADING',
	ERROR = 'GLOBAL_STATE_TYPE/ERROR',
}

export type GlobalState =
	| DefaultGlobalState
	| LoadingGlobalState
	| ErrorGlobalState;

export interface DefaultGlobalState {
	type: GlobalStateType.DEFAULT;
}

export interface LoadingGlobalState {
	type: GlobalStateType.LOADING;
}

export interface ErrorGlobalState {
	type: GlobalStateType.ERROR;
	error: Error;
}


export const initialState: GlobalState = {
	type: GlobalStateType.DEFAULT,
};
