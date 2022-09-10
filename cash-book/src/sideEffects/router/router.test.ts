import * as SE from 'redux-saga/effects';
import { ApplicationActionType, RouterFallback, RouterGoTo } from '../../applicationState/actions';
import { partialApplicationState } from '../fixtures';
import { makeFallbackWorker, makeGoToWorker } from './router';
import { selectAppState } from '../../applicationState';
import { expectSaga } from 'redux-saga-test-plan';
import { ROUTES_ACCOUNTS, ROUTES_CREATE_BOOK_ENTRY, ROUTES_SUPPORT, ROUTES_TRANSACTIONS } from '../../variables/routes';
import { DOCS_SUPPORT } from '../../variables/externalLinks';

describe(makeGoToWorker.name, () => {
	test('when called, then calls goTo and scrollToTheTop', async () => {
		const goTo = jest.fn();
		const scrollToTheTop = jest.fn();
		const action: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: 'ANY',
		};
		await expectSaga(makeGoToWorker({ goTo, goToExternal: () => {}, scrollToTheTop: scrollToTheTop }))
			.dispatch(action)
			.run({ silenceTimeout: true });
		expect(goTo).toBeCalledWith('ANY');
		expect(scrollToTheTop).toBeCalled();
	});

	test('given ROUTES_SUPPORT, when called, then calls goToExternal with DOCS_SUPPORT', async () => {
		const goToExternal = jest.fn();
		const scrollToTheTop = jest.fn();
		const action: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: ROUTES_SUPPORT,
		};
		await expectSaga(makeGoToWorker({ goTo: () => {}, goToExternal, scrollToTheTop: scrollToTheTop }))
			.dispatch(action)
			.run({ silenceTimeout: true });
		expect(goToExternal).toBeCalledWith(DOCS_SUPPORT);
		expect(scrollToTheTop).not.toBeCalled();
	});
});

describe(makeFallbackWorker.name, () => {
	test('given filled state, when called, then puts expected action', async () => {
		const filledState = {
			...partialApplicationState,
		};
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		const expectedAction: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: ROUTES_CREATE_BOOK_ENTRY,
		};
		await expectSaga(makeFallbackWorker())
			.dispatch(action)
			.provide([[SE.select(selectAppState), filledState]])
			.put(expectedAction)
			.run({ silenceTimeout: true });
	});

	test('given state without transactions, when called, then calls goTo with expected path', async () => {
		const stateWithoutTransactions = {
			...partialApplicationState,
			transactions: {
				...partialApplicationState.transactions,
				templates: {},
			},
		};
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		const expectedAction: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: ROUTES_TRANSACTIONS,
		};
		await expectSaga(makeFallbackWorker())
			.dispatch(action)
			.provide([[SE.select(selectAppState), stateWithoutTransactions]])
			.put(expectedAction)
			.run({ silenceTimeout: true });
	});

	test('given state without accounts, when called, then calls goTo with expected path', async () => {
		const stateWithoutAccounts = {
			...partialApplicationState,
			accounts: {
				...partialApplicationState.accounts,
				accounts: {},
			},
		};
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		const expectedAction: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: ROUTES_ACCOUNTS,
		};
		await expectSaga(makeFallbackWorker())
			.dispatch(action)
			.provide([[SE.select(selectAppState), stateWithoutAccounts]])
			.put(expectedAction)
			.run({ silenceTimeout: true });
	});
});
