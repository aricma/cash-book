import * as SE from 'redux-saga/effects';
import { ApplicationActionType } from '../../applicationState/actions';
import { ApplicationState, selectAppState } from '../../applicationState';
import { GlobalStateType } from '../../features/application/state';
import { SettingsSaveType } from '../../features/settings/state';
import { AccountType } from '../../features/accounts/state';
import { TransactionType } from '../../features/transactions/state';
import {CreateBookEntry} from '../../features/bookEntries/state';
import { makeEditBookEntryWorker, editBookEntryReducer } from './makeEditBookEntryWorker';
import { expectSaga } from 'redux-saga-test-plan';

const state: ApplicationState = {
	global: {
		type: GlobalStateType.DEFAULT,
	},
	settings: {
		save: SettingsSaveType.AUTO,
	},
	accounts: {
		create: {
			type: AccountType.DEFAULT,
		},
		accounts: {
			A: {
				id: 'A',
				type: AccountType.DEFAULT,
				name: 'Acc A',
				number: '1000',
			},
			B: {
				id: 'B',
				type: AccountType.DIFFERENCE,
				name: 'Acc B',
				number: '2000',
			},
			C: {
				id: 'C',
				type: AccountType.CASH_STATION,
				name: 'Acc C',
				number: '3000',
			},
		},
	},
	transactions: {
		create: {
			transactions: {},
			transactionIds: [],
		},
		templates: {
			T1: {
				id: 'T1',
				name: 'Temp 1',
				diffAccountId: 'B',
				cashierAccountId: 'C',
				transactionIds: ['TA', 'TB', 'SYS_IN', 'SYS_OUT'],
				autoDiffInId: 'SYS_IN',
				autoDiffOutId: 'SYS_OUT',
			},
			T2: {
				id: 'T2',
				name: 'Temp 2',
				diffAccountId: 'B',
				cashierAccountId: 'C',
				transactionIds: [],
				autoDiffInId: 'SYS_IN',
				autoDiffOutId: 'SYS_OUT',
			},
		},
		transactions: {
			TA: {
				id: 'TA',
				type: TransactionType.IN,
				name: 'In',
				accountId: 'A',
			},
			TB: {
				id: 'TB',
				type: TransactionType.OUT,
				name: 'In',
				accountId: 'A',
			},
			SYS_IN: {
				id: 'SYS_IN',
				type: TransactionType.SYS_IN,
				name: 'Sys In',
				accountId: 'B',
			},
			SYS_OUT: {
				id: 'SYS_OUT',
				type: TransactionType.SYS_OUT,
				name: 'Sys Out',
				accountId: 'B',
			},
		},
	},
	bookEntries: {
		create: {
			templates: {},
		},
		templates: {
			T1: {
				'2000-1-1': {
					templateId: 'T1',
					date: '2000-1-1',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {
						TA: '100.00',
						TB: '120.00',
						SYS_IN: '20.00',
						SYS_OUT: '0.00',
					},
				},
			},
		},
	},
};

describe(makeEditBookEntryWorker.name, () => {
	test('when called, then calls put with expected action', async () => {
		const expectedState: CreateBookEntry = {
			date: '2000-1-1',
			templateId: 'T1',
			cash: {
				start: '100.00',
				end: '100.00',
			},
			transactions: {
				TA: '100.00',
				TB: '120.00',
			},
		};
		await expectSaga(makeEditBookEntryWorker(editBookEntryReducer))
			.provide([[SE.select(selectAppState), state]])
			.dispatch({
				type: ApplicationActionType.BOOK_ENTRIES_EDIT,
				templateId: 'T1',
				date: '2000-1-1',
			})
			.put({
				type: ApplicationActionType.BOOK_ENTRIES_EDIT_SET,
				state: expectedState,
			})
			.run({ silenceTimeout: true });
	});

	test('when called and fails, then sets error in state', async () => {
		const fakeEditBookEntryReducer = jest.fn(() => {
			throw Error('ANY');
		});
		await expectSaga(makeEditBookEntryWorker(fakeEditBookEntryReducer))
			.provide([[SE.select(selectAppState), state]])
			.dispatch({
				type: ApplicationActionType.BOOK_ENTRIES_EDIT,
				templateId: 'T1',
				date: '2000-1-1',
			})
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });
	});
});
