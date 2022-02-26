import { Reducer } from '../models/reducers';
import { ButtonProps } from '../models/props';

export interface ReducerExpectationRequest<State, Action> {
	state: State;
	action: Action;
	expectedState: State;
}

export const makeReducerExpectation =
	<State, Actions = any>(reducer: Reducer<State, Actions>) =>
	<Action extends Actions>(req: ReducerExpectationRequest<State, Action>) => {
		expect(reducer(req.state, req.action)).toEqual(req.expectedState);
	};

export const makeDefaultReducerTest = <State>(reducer: Reducer<State, any>, initialState: State) => {
	describe('DEFAULT', () => {
		test('given a non-matching action, when called, then returns same state', () => {
			expect(reducer(initialState, { type: 'ANY_ACTION_TYPE' })).toEqual(initialState);
		});
	});
};

export interface ToPropsExpectationRequest<State, Props> {
	state: State;
	expectedProps: Props;
}

export const makeToPropsExpectation =
	<State, Props>(toProps: (state: State) => Props) =>
	(request: ToPropsExpectationRequest<State, Props>) => {
		expect(toProps(request.state)).toEqual(request.expectedProps);
	};

export const expectBoolean = expect.any(Boolean);
export const expectString = expect.any(String);
export const expectFunction = expect.any(Function);
const makeExpectProps =
	<T>(defaultProps: T) =>
	(props?: any) =>
		expect.objectContaining<T>({
			...defaultProps,
			...(props || {}),
		});
export const expectButtonProps = makeExpectProps<ButtonProps>({
	type: 'BUTTON_PROPS_TYPE',
	title: expectString,
	icon: expectString,
	onSelect: expectFunction,
});
