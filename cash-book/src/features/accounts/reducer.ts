import { Reducer } from '../../models/reducers';
import { AccountsState, AccountType } from './state';
import {
	ApplicationActionType,
	AccountsAction,
} from '../../applicationState/actions';
import {compactObject} from '../../models/utils';

export const reducer: Reducer<AccountsState, AccountsAction> = (
	state,
	action
) => {
	switch (action.type) {
		case ApplicationActionType.ACCOUNTS_SET:
			return action.state;
		case ApplicationActionType.ACCOUNTS_EDIT:
			const account = state.accounts[action.accountId];
			if (account === undefined) return state;
			return {
				...state,
				create: {
					type: account.type,
					name: account.name,
					number: account.id,
				},
			};
		case ApplicationActionType.ACCOUNTS_REMOVE:
			return {
				...state,
				accounts: compactObject({
					...state.accounts,
					[action.accountId]: undefined,
				}),
			};
		case ApplicationActionType.ACCOUNTS_CREATE_SET_TYPE:
			return {
				...state,
				create: {
					...state.create,
					type: action.value,
				},
			};
		case ApplicationActionType.ACCOUNTS_CREATE_SET_NAME:
			return {
				...state,
				create: {
					...state.create,
					name: action.value,
				},
			};
		case ApplicationActionType.ACCOUNTS_CREATE_SET_NUMBER:
			return {
				...state,
				create: {
					...state.create,
					number: action.value,
				},
			};
		case ApplicationActionType.ACCOUNTS_CREATE_SUBMIT:
			if (state.create.number === undefined) return state;
			if (state.create.name === undefined) return state;
			return {
				...state,
				create: {
					type: AccountType.DEFAULT,
				},
				accounts: {
					...state.accounts,
					[state.create.number]: {
						type: state.create.type,
						id: state.create.number,
						name: state.create.name,
					},
				},
			};
		case ApplicationActionType.ACCOUNTS_CREATE_CANCEL:
			return {
				...state,
				create: {
					type: AccountType.DEFAULT,
				},
			};
		default:
			return state;
	}
};
