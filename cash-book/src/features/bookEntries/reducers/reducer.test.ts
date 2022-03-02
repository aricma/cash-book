import {
	ApplicationActionType,
	BookEntriesSet,
	BookEntriesCreateSetTemplate,
	BookEntriesSetTemplate,
	BookEntriesReset,
	BookEntriesEditSet,
} from '../../../applicationState/actions';
import { BookEntriesState, BookEntry, initialState } from '../state';
import { makeReducerExpectation, makeDefaultReducerTest } from '../../../misc/tests';
import { makeReducer } from './reducer';

const expectation = makeReducerExpectation(makeReducer(() => '2001-1-1'));

makeDefaultReducerTest(
	makeReducer(() => '2001-1-1'),
	initialState
);

const baseState: BookEntriesState = {
	create: {
		templates: {},
	},
	templates: {},
};

describe(ApplicationActionType.BOOK_ENTRIES_SET, () => {
	test('when called, then adds book entries', () => {
		const bookEntries = {
			'1': {
				'2000-1-1': makeBookEntry({
					templateId: '1',
					date: '2000-1-1',
				}),
				'2000-1-2': makeBookEntry({
					templateId: '1',
					date: '2000-1-2',
				}),
			},
			'2': {
				'2000-1-3': makeBookEntry({
					templateId: '2',
					date: '2000-1-3',
				}),
			},
		};
		expectation<BookEntriesSet>({
			state: {
				...baseState,
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_SET,
				bookEntries: {
					...bookEntries,
				},
			},
			expectedState: {
				...baseState,
				templates: {
					...bookEntries,
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_RESET, () => {
	test('when called, then resets state', () => {
		expectation<BookEntriesReset>({
			state: {
				...baseState,
				templates: {
					'1': {
						'2000-1-1': makeBookEntry({
							templateId: '1',
							date: '2000-1-1',
						}),
						'2000-1-2': makeBookEntry({
							templateId: '1',
							date: '2000-1-2',
						}),
					},
					'2': {
						'2000-1-3': makeBookEntry({
							templateId: '2',
							date: '2000-1-3',
						}),
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_RESET,
			},
			expectedState: {
				...initialState,
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_EDIT_SET, () => {
	test('when called, then returns expected state', () => {
		const state = {
			...baseState,
			templates: {
				'1': {
					'2000-1-1': makeBookEntry({
						templateId: '1',
						date: '2000-1-1',
					}),
					'2000-1-2': makeBookEntry({
						templateId: '1',
						date: '2000-1-2',
					}),
				},
				'2': {
					'2000-1-3': makeBookEntry({
						templateId: '2',
						date: '2000-1-3',
					}),
				},
			},
		};
		expectation<BookEntriesEditSet>({
			state: {
				...state,
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_EDIT_SET,
				state: {
					templateId: 'A',
					date: '2000-1-1',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {
						'1': '150.00',
						'2': '100.00',
						'3': '50.00',
					},
				},
			},
			expectedState: {
				...state,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-1',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								'1': '150.00',
								'2': '100.00',
								'3': '50.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE, () => {
	test('given no template in create, when called, then adds book entries', () => {
		expectation<BookEntriesCreateSetTemplate>({
			state: {
				...baseState,
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2001-1-1',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				selectedTemplateId: 'A',
			},
		});
	});

	test('given template in create, when called, then adds book entries', () => {
		expectation<BookEntriesSetTemplate>({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2001-1-1',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE,
				templateId: 'A',
			},
			expectedState: {
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2001-1-1',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				selectedTemplateId: 'A',
				templates: {},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL, () => {
	test('when called, then resets create for id', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
				selectedTemplateId: 'A',
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2001-1-1',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				selectedTemplateId: 'A',
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START, () => {
	test('when called, then sets create cash end', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
				templateId: 'A',
				value: '150.00',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '150.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END, () => {
	test('when called, then sets create cash start', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
				templateId: 'A',
				value: '150.00',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '150.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION, () => {
	test('when called, then adds diff transaction to create', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_ADD_DIFF_TRANSACTION,
				templateId: 'A',
				transactionId: 'AD',
				value: '10.00',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: { transactionId: 'AD', value: '10.00' },
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION, () => {
	test('when called, then diffTransaction removed', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: { transactionId: 'AD', value: '10.00' },
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_REMOVE_DIFF_TRANSACTION,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: undefined,
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE, () => {
	test('when called, then sets create date', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
				templateId: 'A',
				date: '2000-1-6',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-6',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION, () => {
	test('given no value for id, when called, then set value for id', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
				templateId: 'A',
				transactionId: 'AC',
				value: '50.00',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
		});
	});

	test('given previous value for id, when called, then set value for id', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
				templateId: 'A',
				transactionId: 'AC',
				value: '60.00',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '60.00',
							},
						},
					},
				},
			},
		});
	});
});

describe(ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT, () => {
	test('when called, then submits the create for id', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: { transactionId: 'AD', value: '10.00' },
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				templates: {
					A: {
						'2000-1-5': {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
								AD: '10.00',
							},
						},
					},
				},
			},
		});
	});

	test('given empty transactions in create, when called, then removes the empty transactions', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: { transactionId: 'AD', value: '10.00' },
							transactions: {
								AA: '100.00',
								X: '',
								AB: '50.00',
								Y: '',
								Z: '',
								AC: '40.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				templates: {
					A: {
						'2000-1-5': {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '40.00',
								AD: '10.00',
							},
						},
					},
				},
			},
		});
	});

	test('given empty diff transaction in create, when called, then removes the empty transaction', () => {
		expectation({
			state: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							diffTransaction: undefined,
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
			action: {
				type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
				templateId: 'A',
			},
			expectedState: {
				...baseState,
				create: {
					templates: {
						A: {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '0.00',
								end: '0.00',
							},
							transactions: {},
						},
					},
				},
				templates: {
					A: {
						'2000-1-5': {
							templateId: 'A',
							date: '2000-1-5',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {
								AA: '100.00',
								AB: '50.00',
								AC: '50.00',
							},
						},
					},
				},
			},
		});
	});
});

interface MakeBookEntryRequest {
	date: string;
	templateId: string;
	cash?: {
		start?: string;
		end?: string;
	};
	transactions?: {
		[transactionId: string]: string;
	};
}

const makeBookEntry = (req: MakeBookEntryRequest): BookEntry => ({
	date: req.date,
	templateId: req.templateId,
	cash: !!req.cash
		? {
				start: '0.00',
				end: '0.00',
				...req.cash,
		  }
		: {
				start: '0.00',
				end: '0.00',
		  },
	transactions: !!req.transactions
		? { ...req.transactions }
		: {
				A: '100.00',
				B: '50.00',
				C: '50.00',
		  },
});
