import { Reducer } from '../../../models/reducers';
import { AccountsState, AccountType, Account } from '../state';
import { ApplicationActionType, AccountsAction } from '../../../applicationState/actions';
import { compactObject } from '../../../models/utils';
import { validateCreateAccount } from '../toProps/validation';

export const makeReducer =
	(createId: () => string): Reducer<AccountsState, AccountsAction> =>
	(state, action) => {
		switch (action.type) {
			case ApplicationActionType.ACCOUNTS_SET:
				return {
					...state,
					accounts: {
						...action.accounts,
					},
				};
			case ApplicationActionType.ACCOUNTS_EDIT: {
				const account = state.accounts[action.accountId];
				if (account === undefined) return state;
				return {
					...state,
					create: {
						id: account.id,
						type: account.type,
						name: account.name,
						number: account.number,
					},
				};
			}
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
			case ApplicationActionType.ACCOUNTS_CREATE_SUBMIT: {
				const accountIsValid = validateCreateAccount(state);
				if (accountIsValid !== undefined) return state;
				const newAccount: Account = {
					id: state.create.id || createId(),
					type: state.create.type,
					name: state.create.name!,
					number: state.create.number!,
				};
				return {
					...state,
					create: {
						type: AccountType.DEFAULT,
					},
					accounts: {
						...state.accounts,
						[newAccount.id]: newAccount,
					},
				};
			}
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
