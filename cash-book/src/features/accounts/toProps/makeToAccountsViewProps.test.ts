import { makeToAccountsViewProps } from './makeToAccountsViewProps';
import { makeToPropsExpectation, expectButtonProps, expectString } from '../../../misc/tests';
import { AccountsState, initialState, AccountType } from '../state';
import { AccountsViewType } from '../props/accountsViewProps';

const dispatch = jest.fn();
const showCreateModel = jest.fn();
const expectation = makeToPropsExpectation(makeToAccountsViewProps({ dispatch, showCreateModel }));

const baseState: AccountsState = {
	...initialState,
};

beforeEach(() => {
	dispatch.mockReset();
	showCreateModel.mockReset();
});

describe(makeToAccountsViewProps.name, () => {
	test('given no empty state, when called, then returns expected props', () => {
		expectation({
			state: {
				...baseState,
			},
			expectedProps: {
				type: AccountsViewType.SKELETON,
				title: expect.any(String),
				create: expectButtonProps(),
				infoBox: {
					title: expectString,
					message: expect.arrayContaining([]),
				},
			},
		});
	});

	test('given accounts in state, when called, then returns expected props', () => {
		expectation({
			state: {
				...baseState,
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
			expectedProps: {
				type: AccountsViewType.DATA,
				title: expect.any(String),
				create: expectButtonProps(),
				accounts: [
					{
						type: 'Cashier',
						title: 'Acc C',
						number: '3000',
						edit: expectButtonProps(),
					},
					{
						type: 'Difference',
						title: 'Acc B',
						number: '2000',
						edit: expectButtonProps(),
					},
					{
						type: '',
						title: 'Acc A',
						number: '1000',
						edit: expectButtonProps(),
					},
				],
			},
		});
	});
});
