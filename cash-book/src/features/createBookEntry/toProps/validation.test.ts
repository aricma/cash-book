import {
	validateIfDateExists,
	DATE_EXISTS_MESSAGE,
	validateCreateBookEntry,
	TRANSACTION_RESULT_MESSAGE,
	TRANSACTION_IS_ZERO_MESSAGE,
	TRANSACTION_FORMAT_MESSAGE,
} from './validation';
import { BookEntriesState } from '../../bookEntries/state';
import { ApplicationState } from '../../../applicationState';
import { TransactionType } from '../../transactions/state';
import { AccountType } from '../../accounts/state';
import { SettingsSaveType } from '../../settings/state';
import { GlobalStateType } from '../../application/state';

describe(validateCreateBookEntry.name, () => {
	const baseState: ApplicationState = {
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
				IN: {
					type: AccountType.DEFAULT,
					id: 'IN',
					name: 'NAME',
					number: '1000',
				},
				OUT: {
					type: AccountType.DEFAULT,
					id: 'OUT',
					name: 'NAME',
					number: '2000',
				},
				DIFF: {
					type: AccountType.DIFFERENCE,
					id: 'DIFF',
					name: 'NAME',
					number: '3000',
				},
				CASH: {
					type: AccountType.CASH_STATION,
					id: 'CASH',
					name: 'NAME',
					number: '4000',
				},
			},
		},
		bookEntries: {
			create: {
				templates: {},
			},
			templates: {},
		},
		transactions: {
			create: {
				transactions: {},
				transactionIds: [],
			},
			templates: {
				A: {
					id: 'A',
					name: 'NAME',
					diffAccountId: 'DIFF',
					cashierAccountId: 'CASH',
					autoDiffInId: '3',
					autoDiffOutId: '4',
					transactionIds: ['1', '2', '5', '6'],
				},
			},
			transactions: {
				1: {
					id: '1',
					type: TransactionType.IN,
					name: 'NAME',
					accountId: 'IN',
				},
				2: {
					id: '2',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
				3: {
					id: '3',
					type: TransactionType.SYS_IN,
					name: 'NAME',
					accountId: 'DIFF',
				},
				4: {
					id: '4',
					type: TransactionType.SYS_OUT,
					name: 'NAME',
					accountId: 'DIFF',
				},
				5: {
					id: '5',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
				6: {
					id: '6',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
			},
		},
	};

	test('given no template id, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
		};
		expect(validateCreateBookEntry(state)).toBe(null);
	});

	test('given no template in transactions state, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
			bookEntries: {
				...baseState.bookEntries,
				selectedTemplateId: 'A',
			},
			transactions: {
				...baseState.transactions,
				templates: {},
			},
		};
		expect(validateCreateBookEntry(state)).toBe(null);
	});

	test('given no template in book entries state, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
			bookEntries: {
				...baseState.bookEntries,
				selectedTemplateId: 'A',
				create: {
					...baseState.bookEntries.create,
					templates: {},
				},
				templates: {},
			},
		};
		expect(validateCreateBookEntry(state)).toBe(null);
	});

	test('given invalid transactions, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
			bookEntries: {
				...baseState.bookEntries,
				selectedTemplateId: 'A',
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
								1: '11',
								2: '0.00',
								5: '11.00',
								6: '',
							},
						},
					},
				},
			},
		};
		const expectedResponse = {
			transactions: {
				1: TRANSACTION_FORMAT_MESSAGE,
				2: TRANSACTION_IS_ZERO_MESSAGE,
			},
		};
		expect(validateCreateBookEntry(state)).toEqual(expectedResponse);
	});

	test('given invalid value, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
			bookEntries: {
				...baseState.bookEntries,
				selectedTemplateId: 'A',
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
								1: '10.00',
								2: '5.00',
								5: '4.00',
							},
						},
					},
				},
			},
		};
		const expectedResponse = {
			value: TRANSACTION_RESULT_MESSAGE('1'),
		};
		expect(validateCreateBookEntry(state)).toEqual(expectedResponse);
	});

	test('given valid data, when called, then returns expected response', () => {
		const state: ApplicationState = {
			...baseState,
			bookEntries: {
				...baseState.bookEntries,
				selectedTemplateId: 'A',
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
								1: '100.00',
								2: '90.00',
								5: '5.00',
							},
							diffTransaction: {
								transactionId: '4',
								value: '5.00',
							},
						},
					},
				},
			},
		};
		expect(validateCreateBookEntry(state)).toBe(null);
	});
});

describe(validateIfDateExists.name, () => {
	const baseState: BookEntriesState = {
		create: {
			templates: {
				A: {
					templateId: 'A',
					date: '2000-1-1',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {},
				},
			},
		},
		templates: {
			A: {
				'2000-1-1': {
					templateId: 'A',
					date: '2000-1-1',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {},
				},
				'2000-1-2': {
					templateId: 'A',
					date: '2000-1-2',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {},
				},
				'2000-1-3': {
					templateId: 'A',
					date: '2000-1-3',
					cash: {
						start: '100.00',
						end: '100.00',
					},
					transactions: {},
				},
			},
		},
	};

	test('given no templateId in state, when called, then returns null', () => {
		expect(validateIfDateExists(baseState)).toBe(null);
	});

	test('given templateId is not in state, when called, then returns null', () => {
		const state: BookEntriesState = {
			...baseState,
			selectedTemplateId: 'B',
		};
		expect(validateIfDateExists(state)).toBe(null);
	});

	test('given templateId is in state and no dates, when called, then returns null', () => {
		const state: BookEntriesState = {
			...baseState,
			create: {
				...baseState.create,
				templates: {
					...baseState.create.templates,
					A: {
						templateId: 'A',
						date: '2000-1-1',
						cash: {
							start: '100.00',
							end: '100.00',
						},
						transactions: {},
					},
				},
			},
			selectedTemplateId: 'A',
			templates: {},
		};
		expect(validateIfDateExists(state)).toBe(null);
	});

	test('given templateId is in state and date does not exists, when called, then returns null', () => {
		const state: BookEntriesState = {
			...baseState,
			create: {
				...baseState.create,
				templates: {
					...baseState.create.templates,
					A: {
						templateId: 'A',
						date: '2000-1-4',
						cash: {
							start: '100.00',
							end: '100.00',
						},
						transactions: {},
					},
				},
			},
			selectedTemplateId: 'A',
		};
		expect(validateIfDateExists(state)).toBe(null);
	});

	test('given templateId is in state and date exists, when called, then returns expected message', () => {
		const state: BookEntriesState = {
			...baseState,
			selectedTemplateId: 'A',
		};
		expect(validateIfDateExists(state)).toBe(DATE_EXISTS_MESSAGE);
	});
});
