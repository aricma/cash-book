import {
	ApplicationActionType,
	AccountsEdit,
	AccountsRemove,
	AccountsCreateSetType,
	AccountsCreateSetName,
	AccountsCreateSetNumber,
	AccountsCreateSubmit,
} from '../../../applicationState/actions';
import { AccountType, initialState } from '../state';
import { makeReducer } from './reducer';
import { makeReducerExpectation, makeDefaultReducerTest } from '../../../misc/tests';

const reducer = makeReducer(() => 'A');

const reducerExpectation = makeReducerExpectation(reducer);

makeDefaultReducerTest(reducer, initialState);

describe(ApplicationActionType.ACCOUNTS_SET, () => {
	test('given state with account and action with account, when called, then returns expected state', () => {
		reducerExpectation({
			state: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {
					B: {
						id: 'B',
						type: AccountType.DEFAULT,
						name: 'Acc B',
						number: '1010',
					},
				},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_SET,
				accounts: {
					A: {
						id: 'A',
						type: AccountType.DEFAULT,
						name: 'Acc A',
						number: '1000',
					},
				},
			},
			expectedState: {
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
				},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_RESET, () => {
	test('when called, then returns expected state', () => {
		reducerExpectation({
			state: {
				create: {
					type: AccountType.DEFAULT,
					name: 'ANY',
					number: 'ANY',
				},
				accounts: {
					B: {
						id: 'B',
						type: AccountType.DEFAULT,
						name: 'Acc B',
						number: '1010',
					},
				},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_RESET,
			},
			expectedState: {
				...initialState,
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_EDIT, () => {
	test('given action with invalid account Id, when called, then returns expected state', () => {
		reducerExpectation<AccountsEdit>({
			state: {
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
				},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_EDIT,
				accountId: 'B',
			},
			expectedState: {
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
				},
			},
		});
	});

	test('given action with valid account Id, when called, then returns expected state', () => {
		reducerExpectation<AccountsEdit>({
			state: {
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
				},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_EDIT,
				accountId: 'A',
			},
			expectedState: {
				create: {
					id: 'A',
					type: AccountType.DEFAULT,
					name: 'Acc A',
					number: '1000',
				},
				accounts: {
					A: {
						id: 'A',
						type: AccountType.DEFAULT,
						name: 'Acc A',
						number: '1000',
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_REMOVE, () => {
	test('given X state and Y action, when called, then returns expected state', () => {
		reducerExpectation<AccountsRemove>({
			state: {
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
				},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_REMOVE,
				accountId: 'A',
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE, () => {
	test('when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSetType>({
			state: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE,
				value: AccountType.DIFFERENCE,
			},
			expectedState: {
				create: {
					type: AccountType.DIFFERENCE,
				},
				accounts: {},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_CREATE_SET_NAME, () => {
	test('when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSetName>({
			state: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SET_NAME,
				value: 'foo',
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
					name: 'foo',
				},
				accounts: {},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER, () => {
	test('when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSetNumber>({
			state: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER,
				value: '1000',
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
					number: '1000',
				},
				accounts: {},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_CREATE_SUBMIT, () => {
	test('given state with valid account without id in create, when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSubmit>({
			state: {
				create: {
					type: AccountType.DEFAULT,
					name: 'Acc A',
					number: '1000',
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,
			},
			expectedState: {
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
				},
			},
		});
	});

	test('given state with valid account with id in create, when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSubmit>({
			state: {
				create: {
					id: 'B',
					type: AccountType.DEFAULT,
					name: 'Acc B',
					number: '1000',
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {
					B: {
						id: 'B',
						type: AccountType.DEFAULT,
						name: 'Acc B',
						number: '1000',
					},
				},
			},
		});
	});

	test('given state with invalid account without id in create, when called, then returns expected state', () => {
		reducerExpectation<AccountsCreateSubmit>({
			state: {
				create: {
					type: AccountType.DEFAULT,
					name: 'Acc A',
					number: '100', // invalid number
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_SUBMIT,
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
					name: 'Acc A',
					number: '100',
				},
				accounts: {},
			},
		});
	});
});

describe(ApplicationActionType.ACCOUNTS_CREATE_CANCEL, () => {
	test('given state with create, when called, then returns expected state', () => {
		reducerExpectation({
			state: {
				create: {
					type: AccountType.DEFAULT,
					name: 'Acc',
					number: '0000',
				},
				accounts: {},
			},
			action: {
				type: ApplicationActionType.ACCOUNTS_CREATE_CANCEL,
			},
			expectedState: {
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {},
			},
		});
	});
});
