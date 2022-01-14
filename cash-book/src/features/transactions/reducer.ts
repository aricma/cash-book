import hash from 'crypto-js/sha1';
import {Reducer} from '../../models/reducers';
import {TransactionsState, Transaction, TransactionType} from './state';
import {TransactionsAction, ApplicationActionType} from '../../applicationState/actions';


export const reducer: Reducer<TransactionsState, TransactionsAction> = (
	state,
	action
) => {
	switch (action.type) {
		case ApplicationActionType.TRANSACTIONS_SET:
			return action.state;
		case ApplicationActionType.TRANSACTIONS_CREATE_SET_TYPE:
			return {
				...state,
				create: {
					...state.create,
					type: action.value,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_SET_NAME:
			return {
				...state,
				create: {
					...state.create,
					name: action.value,
				},
			};
		case ApplicationActionType.TRANSACTIONS_ORDER_DEC: {
			const transaction = state.transactions[action.transactionId];
			if (transaction === undefined) return state;
			const prevTransaction = Object.values(state.transactions).find(({ order }) => order === transaction.order - 1) || undefined;
			if (prevTransaction === undefined) return state;
			return {
				...state,
				transactions: {
					...state.transactions,
					[prevTransaction.id]: {
						...prevTransaction,
						order: prevTransaction.order + 1,
					},
					[transaction.id]: {
						...transaction,
						order: transaction.order - 1,
					}
				}
			}
		}
		case ApplicationActionType.TRANSACTIONS_ORDER_INC: {
			const transaction = state.transactions[action.transactionId];
			if (transaction === undefined) return state;
			const nextTransaction = Object.values(state.transactions).find(({ order }) => order === transaction.order + 1) || undefined;
			if (nextTransaction === undefined) return state;
			return {
				...state,
				transactions: {
					...state.transactions,
					[nextTransaction.id]: {
						...nextTransaction,
						order: nextTransaction.order - 1,
					},
					[transaction.id]: {
						...transaction,
						order: transaction.order + 1,
					}
				}
			}
		}
		case ApplicationActionType.TRANSACTIONS_CREATE_SET_CASH_STATION:
			return {
				...state,
				create: {
					...state.create,
					cashierAccountId: action.value,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_SET_OTHER_ACCOUNT:
			return {
				...state,
				create: {
					...state.create,
					otherAccountId: action.value,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_CANCEL:
			return {
				...state,
				create: {
					type: TransactionType.OUT,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_SUBMIT:
			if (state.create.type === undefined) return state;
			if (state.create.name === undefined) return state;
			if (state.create.cashierAccountId === undefined) return state;
			if (state.create.otherAccountId === undefined) return state;
			const allTransactions = Object.values(state.transactions);
			const getLastOrderNumber = allTransactions.map(({ order }) => order).sort()[allTransactions.length - 1] || 0;
			const fromAccountId =
				state.create.type === TransactionType.OUT
					? state.create.cashierAccountId
					: state.create.otherAccountId;
			const toAccountId =
				state.create.type === TransactionType.IN
					? state.create.cashierAccountId
					: state.create.otherAccountId;
			const newTransactionId = hash(state.create.name + fromAccountId + toAccountId).toString();
			const newTransaction: Transaction = {
				id: newTransactionId,
				order: getLastOrderNumber + 1,
				type: state.create.type,
				fromAccountId: fromAccountId,
				toAccountId: toAccountId,
				name: state.create.name,
			};
			return {
				...state,
				create: {
					type: TransactionType.OUT,
				},
				transactions: {
					...state.transactions,
					[newTransactionId]: newTransaction,
				},
			};
		default:
			return state;
	}
};
