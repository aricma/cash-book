export type Action<Type, Payload = {}> = { type: Type } & Payload;
export type Reducer<State, Action> = (state: State, action: Action) => State;

export type ToReduxReducer = <State>(
	reducer: Reducer<State, any>,
	initialState: State
) => (state: State | undefined, action: any) => State;
export const toReduxReducer: ToReduxReducer = (reducer, initialState) => (state, action) => {
	return reducer(state || initialState, action);
};
