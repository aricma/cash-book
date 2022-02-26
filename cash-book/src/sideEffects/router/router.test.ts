import * as SE from 'redux-saga/effects';
import { RouterGoTo, ApplicationActionType, RouterFallback } from '../../applicationState/actions';
import { PartialApplicationState, partialApplicationState } from '../fixtures';
import { makeGoToWorker, makeFallbackWorker } from './router';
import { selectAppState } from '../../applicationState';
import { expectSaga } from 'redux-saga-test-plan';
import { ROUTES_SUPPORT, ROUTES_CREATE_BOOK_ENTRY, ROUTES_ACCOUNTS, ROUTES_TRANSACTIONS } from '../../variables/routes';
import { DOCS_SUPPORT } from '../../variables/externalLinks';

describe(makeGoToWorker.name, () => {
	test('when called, then calls goTo', async () => {
		const goTo = jest.fn();
		const action: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: 'ANY',
		};
		await expectSaga(makeGoToWorker(goTo, () => {}))
			.dispatch(action)
			.run({ silenceTimeout: true });
		expect(goTo).toBeCalledWith('ANY');
	});

	test('given ROUTES_SUPPORT, when called, then calls goToExternal with DOCS_SUPPORT', async () => {
		const goToExternal = jest.fn();
		const action: RouterGoTo = {
			type: ApplicationActionType.ROUTER_GO_TO,
			path: ROUTES_SUPPORT,
		};
		await expectSaga(makeGoToWorker(() => {}, goToExternal))
			.dispatch(action)
			.run({ silenceTimeout: true });
		expect(goToExternal).toBeCalledWith(DOCS_SUPPORT);
	});
});

describe(makeFallbackWorker.name, () => {
	test('given filled state, when called, then calls goTo with expected path', async () => {
		const filledState: PartialApplicationState = {
			...partialApplicationState,
		};
		const goTo = jest.fn();
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		await expectSaga(makeFallbackWorker(goTo))
			.dispatch(action)
			.provide([[SE.select(selectAppState), filledState]])
			.run({ silenceTimeout: true });

		expect(goTo).toBeCalledWith(ROUTES_CREATE_BOOK_ENTRY);
	});

	test('given state without transactions, when called, then calls goTo with expected path', async () => {
		const stateWithoutTransactions: PartialApplicationState = {
			...partialApplicationState,
			transactions: {
				...partialApplicationState.transactions,
				templates: {},
			},
		};
		const goTo = jest.fn();
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		await expectSaga(makeFallbackWorker(goTo))
			.dispatch(action)
			.provide([[SE.select(selectAppState), stateWithoutTransactions]])
			.run({ silenceTimeout: true });

		expect(goTo).toBeCalledWith(ROUTES_TRANSACTIONS);
	});

	test('given state without accounts, when called, then calls goTo with expected path', async () => {
		const stateWithoutAccounts: PartialApplicationState = {
			...partialApplicationState,
			accounts: {
				...partialApplicationState.accounts,
				accounts: {},
			},
		};
		const goTo = jest.fn();
		const action: RouterFallback = {
			type: ApplicationActionType.ROUTER_FALLBACK,
		};
		await expectSaga(makeFallbackWorker(goTo))
			.dispatch(action)
			.provide([[SE.select(selectAppState), stateWithoutAccounts]])
			.run({ silenceTimeout: true });

		expect(goTo).toBeCalledWith(ROUTES_ACCOUNTS);
	});
});
