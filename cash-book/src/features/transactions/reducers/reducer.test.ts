import {
	ApplicationActionType,
	TransactionsSet,
	TransactionsMove,
	TransactionsOrderInc,
	TransactionsCreateTransactionAdd,
	TransactionsCreateTransactionRemove,
	TransactionsCreateTransactionSetType,
	TransactionsCreateTransactionSetAccount,
	TransactionsCreateTemplateCancel,
	TransactionsCreateTransactionSetName,
	TransactionsEdit,
	TransactionsCreateSubmit,
} from '../../../applicationState/actions';
import { makeReducerExpectation, makeDefaultReducerTest } from '../../../misc/tests';
import { makeReducer } from './reducer';
import { initialState, TransactionsState, TransactionType } from '../state';

const makeFakeId = jest.fn(() => 'X');
const expectation = makeReducerExpectation(makeReducer(makeFakeId));

makeDefaultReducerTest(makeReducer(makeFakeId), initialState);

const baseState: TransactionsState = {
	create: {
		transactions: {},
		transactionIds: [],
	},
	transactions: {},
	templates: {},
};

beforeEach(() => {
	makeFakeId.mockReset();
});

describe(ApplicationActionType.TRANSACTIONS_SET, () => {
	test('when called, then returns expected state', () => {
		const newState: TransactionsState = {
			...baseState,
			create: {
				id: 'A',
				transactions: {
					TA: {
						id: 'TA',
						type: TransactionType.IN,
						name: 'TA',
						accountId: 'ANY',
					},
				},
				transactionIds: ['1', '2', '3'],
			},
			transactions: {
				X: {
					id: 'X',
					name: 'TX',
					type: TransactionType.IN,
					accountId: 'ANY',
				},
			},
			templates: {},
		};
		expectation<TransactionsSet>({
			state: {
				...baseState,
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_SET,
				state: newState,
			},
			expectedState: {
				...newState,
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_RESET, () => {
	test('when called, then returns expected state', () => {
		const state: TransactionsState = {
			...baseState,
			create: {
				id: 'A',
				transactions: {
					TA: {
						id: 'TA',
						type: TransactionType.IN,
						name: 'TA',
						accountId: 'ANY',
					},
				},
				transactionIds: ['1', '2', '3'],
			},
			transactions: {
				X: {
					id: 'X',
					name: 'TX',
					type: TransactionType.IN,
					accountId: 'ANY',
				},
			},
			templates: {},
		};
		expectation({
			state: {
				...state,
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_RESET,
			},
			expectedState: {
				...initialState,
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_EDIT, () => {
	const localBaseState: TransactionsState = {
		...baseState,
		templates: {
			A: {
				id: 'A',
				name: 'ANY',
				transactionIds: ['1', '2', '3'],
				cashierAccountId: 'ANY',
				autoDiffInId: 'ANY',
				diffAccountId: 'ANY',
				autoDiffOutId: 'ANY',
			},
		},
		transactions: {
			1: {
				id: '1',
				name: 'ANY',
				type: TransactionType.IN,
				accountId: '1000',
			},
			2: {
				id: '2',
				name: 'ANY',
				type: TransactionType.IN,
				accountId: '1000',
			},
			3: {
				id: '3',
				name: 'ANY',
				type: TransactionType.IN,
				accountId: '1000',
			},
		},
	};

	test('given template is already in edit mode, when called, then returns expected state', () => {
		const state: TransactionsState = {
			...localBaseState,
			create: {
				id: 'A',
				name: 'NEW NAME FROM EDITING',
				transactions: {
					1: {
						id: '1',
						name: 'ANY',
						type: TransactionType.IN,
						accountId: '1000',
					},
					2: {
						id: '2',
						name: 'ANY',
						type: TransactionType.IN,
						accountId: '1000',
					},
					3: {
						id: '3',
						name: 'ANY',
						type: TransactionType.IN,
						accountId: '1000',
					},
				},
				transactionIds: ['1', '2', '3'],
				cashierAccountId: 'ANY',
				autoDiffInId: 'ANY',
				diffAccountId: 'ANY',
				autoDiffOutId: 'ANY',
			},
		};
		expectation<TransactionsEdit>({
			state: {
				...state,
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_EDIT,
				templateId: 'A',
			},
			expectedState: {
				...state,
			},
		});
	});

	test('when called, then returns expected state', () => {
		expectation<TransactionsEdit>({
			state: {
				...localBaseState,
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_EDIT,
				templateId: 'A',
			},
			expectedState: {
				...localBaseState,
				create: {
					id: 'A',
					name: 'ANY',
					transactions: {
						1: {
							id: '1',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: '1000',
						},
						2: {
							id: '2',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: '1000',
						},
						3: {
							id: '3',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: '1000',
						},
					},
					transactionIds: ['1', '2', '3'],
					cashierAccountId: 'ANY',
					autoDiffInId: 'ANY',
					diffAccountId: 'ANY',
					autoDiffOutId: 'ANY',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_MOVE, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsMove>({
			state: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['1', '2', '3'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_MOVE,
				templateId: 'A',
				fromIndex: 0,
				toIndex: 2,
			},
			expectedState: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['2', '3', '1'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_ORDER_INC, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsOrderInc>({
			state: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['1', '2', '3'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_ORDER_INC,
				templateId: 'A',
				transactionId: '2',
			},
			expectedState: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['1', '3', '2'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_ORDER_DEC, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['1', '2', '3'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_ORDER_DEC,
				templateId: 'A',
				transactionId: '2',
			},
			expectedState: {
				...baseState,
				templates: {
					A: {
						id: 'A',
						name: 'ANY',
						transactionIds: ['2', '1', '3'],
						cashierAccountId: 'ANY',
						autoDiffInId: 'ANY',
						diffAccountId: 'ANY',
						autoDiffOutId: 'ANY',
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				create: {
					...baseState,
					id: 'A',
					name: 'ANY',
					transactions: {
						1: {
							id: '1',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						2: {
							id: '2',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						3: {
							id: '3',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
					},
					transactionIds: ['1', '2', '3'],
					cashierAccountId: 'ANY',
					autoDiffInId: 'ANY',
					diffAccountId: 'ANY',
					autoDiffOutId: 'ANY',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC,
				templateId: 'A',
				transactionId: '2',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState,
					id: 'A',
					name: 'ANY',
					transactions: {
						1: {
							id: '1',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						2: {
							id: '2',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						3: {
							id: '3',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
					},
					transactionIds: ['2', '1', '3'],
					cashierAccountId: 'ANY',
					autoDiffInId: 'ANY',
					diffAccountId: 'ANY',
					autoDiffOutId: 'ANY',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				create: {
					...baseState,
					id: 'A',
					name: 'ANY',
					transactions: {
						1: {
							id: '1',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						2: {
							id: '2',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						3: {
							id: '3',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
					},
					transactionIds: ['1', '2', '3'],
					cashierAccountId: 'ANY',
					autoDiffInId: 'ANY',
					diffAccountId: 'ANY',
					autoDiffOutId: 'ANY',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC,
				templateId: 'A',
				transactionId: '2',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState,
					id: 'A',
					name: 'ANY',
					transactions: {
						1: {
							id: '1',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						2: {
							id: '2',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
						3: {
							id: '3',
							name: 'ANY',
							type: TransactionType.IN,
							accountId: 'ANY',
						},
					},
					transactionIds: ['1', '3', '2'],
					cashierAccountId: 'ANY',
					autoDiffInId: 'ANY',
					diffAccountId: 'ANY',
					autoDiffOutId: 'ANY',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				create: {
					...baseState.create,
					name: 'OLD NAME',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME,
				transactionId: 'B',
				name: 'NEW NAME',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					name: 'NEW NAME',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				create: {
					...baseState.create,
					cashierAccountId: 'OLD',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT,
				cashierAccountId: 'NEW',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					cashierAccountId: 'NEW',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT, () => {
	test('when called, then returns expected state', () => {
		expectation({
			state: {
				...baseState,
				create: {
					...baseState.create,
					diffAccountId: 'OLD',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT,
				diffAccountId: 'NEW',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					diffAccountId: 'NEW',
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD, () => {
	test('when called, then returns expected state', () => {
		makeFakeId.mockImplementation(() => 'NEW_TRANSACTION');
		expectation<TransactionsCreateTransactionAdd>({
			state: {
				...baseState,
				transactions: {},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						NEW_TRANSACTION: {
							id: 'NEW_TRANSACTION',
							type: TransactionType.OUT,
						},
					},
					transactionIds: ['NEW_TRANSACTION'],
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsCreateTransactionRemove>({
			state: {
				...baseState,
				create: {
					...baseState.create,
					transactionIds: ['OLD'],
					transactions: {
						OLD: {
							id: 'OLD',
							type: TransactionType.OUT,
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
				transactionId: 'OLD',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					transactionIds: [],
					transactions: {},
				},
			},
		});
	});

	test('given wrong id, when called, then returns expected state', () => {
		const state = {
			...baseState,
			create: {
				...baseState.create,
				transactionIds: ['ANY'],
				transactions: {
					ANY: {
						id: 'ANY',
						type: TransactionType.OUT,
					},
				},
			},
		};
		expectation<TransactionsCreateTransactionRemove>({
			state: {
				...state,
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
				transactionId: 'WRONG',
			},
			expectedState: {
				...state,
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsCreateTransactionSetName>({
			state: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.OUT,
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME,
				transactionId: 'A',
				name: 'NEW NAME',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							name: 'NEW NAME',
							type: TransactionType.OUT,
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsCreateTransactionSetType>({
			state: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.OUT,
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE,
				transactionId: 'A',
				transactionType: TransactionType.IN,
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.IN,
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsCreateTransactionSetAccount>({
			state: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.OUT,
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT,
				transactionId: 'A',
				accountId: '1000',
			},
			expectedState: {
				...baseState,
				create: {
					...baseState.create,
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.OUT,
							accountId: '1000',
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL, () => {
	test('when called, then returns expected state', () => {
		expectation<TransactionsCreateTemplateCancel>({
			state: {
				...baseState,
				create: {
					...baseState.create,
					name: 'ANY',
					transactions: {
						A: {
							id: 'A',
							type: TransactionType.OUT,
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL,
			},
			expectedState: {
				...baseState,
			},
		});
	});
});

describe(ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT, () => {
	const localBaseState: TransactionsState = {
		...baseState,
		create: {
			name: 'NAME',
			transactions: {
				1: {
					id: '1',
					name: 'T1',
					type: TransactionType.IN,
					accountId: 'X',
				},
				2: {
					id: '2',
					name: 'T2',
					type: TransactionType.OUT,
					accountId: 'X',
				},
			},
			transactionIds: ['1', '2'],
			cashierAccountId: 'C',
			autoDiffInId: '3',
			autoDiffOutId: '4',
			diffAccountId: 'D',
		},
		transactions: {
			1: {
				id: '1',
				name: 'T1',
				type: TransactionType.IN,
				accountId: 'X',
			},
			2: {
				id: '2',
				name: 'T2',
				type: TransactionType.OUT,
				accountId: 'X',
			},
			3: {
				id: '3',
				name: 'Auto Difference In',
				type: TransactionType.SYS_IN,
				accountId: 'D',
			},
			4: {
				id: '4',
				name: 'Auto Difference Out',
				type: TransactionType.SYS_OUT,
				accountId: 'D',
			},
		},
	};

	const expectedState: TransactionsState = {
		...baseState,
		create: {
			transactions: {},
			transactionIds: [],
		},
		templates: {
			A: {
				id: 'A',
				name: 'NAME',
				transactionIds: ['1', '2'],
				cashierAccountId: 'C',
				autoDiffInId: '3',
				autoDiffOutId: '4',
				diffAccountId: 'D',
			},
		},
		transactions: {
			1: {
				id: '1',
				name: 'T1',
				type: TransactionType.IN,
				accountId: 'X',
			},
			2: {
				id: '2',
				name: 'T2',
				type: TransactionType.OUT,
				accountId: 'X',
			},
			3: {
				id: '3',
				name: 'Auto Difference In',
				type: TransactionType.SYS_IN,
				accountId: 'D',
			},
			4: {
				id: '4',
				name: 'Auto Difference Out',
				type: TransactionType.SYS_OUT,
				accountId: 'D',
			},
		},
	};

	test('given create with id and auto diff transactions, when called, then returns expected state', () => {
		makeFakeId.mockReturnValueOnce('3');
		makeFakeId.mockReturnValueOnce('4');
		expectation<TransactionsCreateSubmit>({
			state: {
				...localBaseState,
				create: {
					...localBaseState.create,
					id: 'A',
				},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT,
			},
			expectedState: {
				...expectedState,
			},
		});
	});

	test('given create without id and auto diff transactions, when called, then returns expected state', () => {
		makeFakeId.mockReturnValueOnce('A');
		makeFakeId.mockReturnValueOnce('3');
		makeFakeId.mockReturnValueOnce('4');
		expectation<TransactionsCreateSubmit>({
			state: {
				...localBaseState,
				create: {
					...localBaseState.create,
					transactions: {
						1: {
							id: '1',
							name: 'T1',
							type: TransactionType.IN,
							accountId: 'X',
						},
						2: {
							id: '2',
							name: 'T2',
							type: TransactionType.OUT,
							accountId: 'X',
						},
					},
					transactionIds: ['1', '2'],
					cashierAccountId: 'C',
					autoDiffInId: '3',
					autoDiffOutId: '4',
					diffAccountId: 'D',
				},
				transactions: {},
			},
			action: {
				type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT,
			},
			expectedState: {
				...expectedState,
			},
		});
	});
});
