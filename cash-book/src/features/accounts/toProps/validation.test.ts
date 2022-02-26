import { AccountsState, AccountType } from '../state';
import { validateCreateAccount } from './validation';

const baseState: AccountsState = {
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
			type: AccountType.DEFAULT,
			name: 'Acc B',
			number: '2000',
		},
		C: {
			id: 'C',
			type: AccountType.CASH_STATION,
			name: 'Acc C',
			number: '3000',
		},
		D: {
			id: 'D',
			type: AccountType.DIFFERENCE,
			name: 'Acc D',
			number: '4000',
		},
	},
};

describe(validateCreateAccount.name, () => {
	interface TestCase {
		message: string;
		state: AccountsState;
		expected: ReturnType<typeof validateCreateAccount>;
	}
	const testCases: Array<TestCase> = [
		{
			message: 'given colliding number, when called, then returns expected',
			state: {
				...baseState,
				create: {
					...baseState.create,
					number: '1000',
				},
			},
			expected: expect.objectContaining({
				number: 'Account is already taken by "Acc A"!',
			}),
		},
		{
			message: 'given colliding id, when called, then returns expected',
			state: {
				...baseState,
				create: {
					...baseState.create,
					id: 'A',
					number: '1000',
				},
			},
			expected: expect.objectContaining({
				number: undefined,
			}),
		},
		{
			message: 'given colliding id, when called, then returns expected',
			state: {
				...baseState,
				create: {
					...baseState.create,
					number: undefined,
				},
			},
			expected: expect.objectContaining({
				number: 'Number is missing!',
			}),
		},
	];

	testCases.forEach((testCase) => {
		test(testCase.message, () => {
			expect(validateCreateAccount(testCase.state)).toEqual(testCase.expected);
		});
	});
});
