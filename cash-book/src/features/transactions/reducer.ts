import hash from 'crypto-js/sha1';
import { Reducer } from '../../models/reducers';
import { TransactionsState, Transaction, TransactionType, Template, CreateTransaction } from './state';
import { TransactionsAction, ApplicationActionType } from '../../applicationState/actions';
import { compactObject, move } from '../../models/utils';

export const reducer: Reducer<TransactionsState, TransactionsAction> = (state, action) => {
	switch (action.type) {
		case ApplicationActionType.TRANSACTIONS_SET:
			return action.state;
		case ApplicationActionType.TRANSACTIONS_EDIT: {
			const template = state.templates[action.templateId];
			if (template === undefined) return state;
			if (template.id === state.create.id) return state;

			interface CreateConfig {
				diffAccountId?: string;
				cashierAccountId?: string;
				transactions: {
					[transactionId: string]: CreateTransaction;
				};
			}

			const data = template.transactions.reduce(
				(data: CreateConfig, transactionId) => {
					const transaction = state.transactions[transactionId];
					return {
						...data,
						cashierAccountId: template.cashierAccountId,
						transactions: {
							...data.transactions,
							[transaction.id]: {
								id: transaction.id,
								type: transaction.type,
								name: transaction.name,
								accountId: transaction.accountId,
							},
						},
					};
				},
				{ transactions: {} }
			);
			return {
				...state,
				create: {
					id: template.id,
					name: template.name,
					cashierAccountId: data.cashierAccountId,
					diffAccountId: data.diffAccountId,
					transactionIds: template.transactions,
					transactions: data.transactions,
					autoDiffInId: template.autoDiffInId,
					autoDiffOutId: template.autoDiffOutId,
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_MOVE: {
			const template = state.templates[action.templateId];
			if (template === undefined) return state;
			const transactions = template.transactions;
			const newOrder = move(transactions, action.fromIndex, action.toIndex);
			return {
				...state,
				templates: {
					...state.templates,
					[action.templateId]: {
						...template,
						transactions: newOrder,
					},
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_ORDER_INC: {
			const template = state.templates[action.templateId];
			if (template === undefined) return state;
			const transactions = template.transactions;
			const currentIndex = transactions.findIndex((id) => id === action.transactionId);
			if (currentIndex === -1) return state;
			const newOrder = move(transactions, currentIndex, currentIndex + 1);
			return {
				...state,
				templates: {
					...state.templates,
					[action.templateId]: {
						...template,
						transactions: newOrder,
					},
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_ORDER_DEC: {
			const template = state.templates[action.templateId];
			if (template === undefined) return state;
			const transactions = template.transactions;
			const currentIndex = transactions.findIndex((id) => id === action.transactionId);
			if (currentIndex === -1) return state;
			const newOrder = move(transactions, currentIndex, currentIndex - 1);
			return {
				...state,
				templates: {
					...state.templates,
					[action.templateId]: {
						...template,
						transactions: newOrder,
					},
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC: {
			const currentIndex = state.create.transactionIds.findIndex((id) => id === action.transactionId);
			if (currentIndex === -1) return state;
			const newOrder = move(state.create.transactionIds, currentIndex, currentIndex - 1);
			return {
				...state,
				create: {
					...state.create,
					transactionIds: newOrder,
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC:
			const currentIndex = state.create.transactionIds.findIndex((id) => id === action.transactionId);
			if (currentIndex === -1) return state;
			const newOrder = move(state.create.transactionIds, currentIndex, currentIndex + 1);
			return {
				...state,
				create: {
					...state.create,
					transactionIds: newOrder,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME:
			return {
				...state,
				create: {
					...state.create,
					name: action.name,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT:
			return {
				...state,
				create: {
					...state.create,
					cashierAccountId: action.cashierAccountId,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT:
			return {
				...state,
				create: {
					...state.create,
					diffAccountId: action.diffAccountId,
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD: {
			const transactionId = hash(new Date().toISOString()).toString();
			return {
				...state,
				create: {
					...state.create,
					transactionIds: [...state.create.transactionIds, transactionId],
					transactions: {
						...state.create.transactions,
						[transactionId]: {
							id: transactionId,
							type: TransactionType.OUT,
						},
					},
				},
			};
		}
		case ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE:
			return {
				...state,
				create: {
					...state.create,
					transactionIds: state.create.transactionIds.filter((id) => id !== action.transactionId),
					transactions: compactObject({
						...state.create.transactions,
						[action.transactionId]: undefined,
					}),
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME:
			return {
				...state,
				create: {
					...state.create,
					transactions: {
						...state.create.transactions,
						[action.transactionId]: {
							...state.create.transactions[action.transactionId],
							name: action.name,
						},
					},
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE:
			return {
				...state,
				create: {
					...state.create,
					transactions: {
						...state.create.transactions,
						[action.transactionId]: {
							...state.create.transactions[action.transactionId],
							type: action.transactionType,
						},
					},
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT:
			return {
				...state,
				create: {
					...state.create,
					transactions: {
						...state.create.transactions,
						[action.transactionId]: {
							...state.create.transactions[action.transactionId],
							accountId: action.accountId,
						},
					},
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL:
			return {
				...state,
				create: {
					transactionIds: [],
					transactions: {},
				},
			};
		case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT: {
			const templateId = state.create.id || hash(new Date().toISOString()).toString();
			if (state.create.name === undefined) return state;
			const newTransactions = Object.values(state.create.transactions).reduce(
				(transactions: { [transactionId: string]: Transaction }, config) => {
					if (config.accountId === undefined) return transactions;
					if (config.name === undefined) return transactions;
					const newTransaction: Transaction = {
						id: config.id,
						type: config.type,
						name: config.name,
						accountId: config.accountId,
					};
					return {
						...transactions,
						[newTransaction.id]: newTransaction,
					};
				},
				{}
			);
			const cashierAccountId = state.create.cashierAccountId;
			const diffAccountId = state.create.diffAccountId;
			if (cashierAccountId === undefined) return state;
			if (diffAccountId === undefined) return state;
			const diffInTransaction: Transaction = {
				id: hash(new Date().toISOString() + '__auto-difference-in').toString(),
				name: 'Auto Difference In',
				type: TransactionType.SYS_IN,
				accountId: diffAccountId,
			};
			const diffOutTransaction: Transaction = {
				id: hash(new Date().toISOString() + '__auto-difference-out').toString(),
				name: 'Auto Difference Out',
				type: TransactionType.SYS_OUT,
				accountId: diffAccountId,
			};
			const newTemplate: Template = {
				id: templateId,
				name: state.create.name,
				cashierAccountId: cashierAccountId,
				diffAccountId: diffAccountId,
				transactions: state.create.transactionIds,
				autoDiffInId: state.create.autoDiffInId || diffInTransaction.id,
				autoDiffOutId: state.create.autoDiffOutId || diffOutTransaction.id,
			};
			return {
				...state,
				create: {
					transactionIds: [],
					transactions: {},
				},
				templates: {
					...state.templates,
					[templateId]: newTemplate,
				},
				transactions: compactObject({
					...state.transactions,
					...newTransactions,
					[diffInTransaction.id]: state.transactions[state.create.autoDiffInId || ''] || diffInTransaction,
					[diffOutTransaction.id]: state.transactions[state.create.autoDiffOutId || ''] || diffOutTransaction,
				}),
			};
		}
		default:
			return state;
	}
};
