import { Reducer } from '../../../models/reducers';
import { TransactionsState, Transaction, TransactionType, Template, CreateTransaction, initialState } from '../state';
import { TransactionsAction, ApplicationActionType } from '../../../applicationState/actions';
import { compactObject, move } from '../../../models/utils';

export const makeReducer =
	(makeID: () => string): Reducer<TransactionsState, TransactionsAction> =>
	(state, action) => {
		switch (action.type) {
			case ApplicationActionType.TRANSACTIONS_SET:
				return action.state;
			case ApplicationActionType.TRANSACTIONS_RESET:
				return {
					...initialState,
				};
			case ApplicationActionType.TRANSACTIONS_EDIT: {
				const template = state.templates[action.templateId];
				if (template.id === state.create.id) return state;

				interface CreateConfig {
					[transactionId: string]: CreateTransaction;
				}

				const transactions = template.transactionIds.reduce((data: CreateConfig, transactionId) => {
					const transaction = state.transactions[transactionId];
					return {
						...data,
						[transaction.id]: {
							id: transaction.id,
							type: transaction.type,
							name: transaction.name,
							accountId: transaction.accountId,
						},
					};
				}, {});
				return {
					...state,
					create: {
						id: template.id,
						name: template.name,
						cashierAccountId: template.cashierAccountId,
						diffAccountId: template.diffAccountId,
						transactionIds: template.transactionIds,
						transactions: transactions,
						autoDiffInId: template.autoDiffInId,
						autoDiffOutId: template.autoDiffOutId,
					},
				};
			}
			case ApplicationActionType.TRANSACTIONS_MOVE: {
				const template = state.templates[action.templateId];
				const transactionIds = template.transactionIds;
				const newOrder = move(transactionIds, action.fromIndex, action.toIndex);
				return {
					...state,
					templates: {
						...state.templates,
						[action.templateId]: {
							...template,
							transactionIds: newOrder,
						},
					},
				};
			}
			case ApplicationActionType.TRANSACTIONS_ORDER_INC: {
				const template = state.templates[action.templateId];
				const transactionIds = template.transactionIds;
				const currentIndex = transactionIds.findIndex((id) => id === action.transactionId);
				const newOrder = move(transactionIds, currentIndex, currentIndex + 1);
				return {
					...state,
					templates: {
						...state.templates,
						[action.templateId]: {
							...template,
							transactionIds: newOrder,
						},
					},
				};
			}
			case ApplicationActionType.TRANSACTIONS_ORDER_DEC: {
				const template = state.templates[action.templateId];
				const transactionIds = template.transactionIds;
				const currentIndex = transactionIds.findIndex((id) => id === action.transactionId);
				const newOrder = move(transactionIds, currentIndex, currentIndex - 1);
				return {
					...state,
					templates: {
						...state.templates,
						[action.templateId]: {
							...template,
							transactionIds: newOrder,
						},
					},
				};
			}
			case ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC: {
				const currentIndex = state.create.transactionIds.findIndex((id) => id === action.transactionId);
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
				const transactionId = makeID();
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
				const templateId = state.create.id || makeID();
				const name = state.create.name!; // validation in toProps
				const cashierAccountId = state.create.cashierAccountId!; // validation in toProps
				const diffAccountId = state.create.diffAccountId!; // validation in toProps
				const autoDiffInId = state.create.autoDiffInId!; // validation in toProps
				const autoDiffOutId = state.create.autoDiffOutId!; // validation in toProps
				const newTransactions = Object.values(state.create.transactions).reduce(
					(transactions: { [transactionId: string]: Transaction }, config) => {
						const newTransaction: Transaction = {
							id: config.id,
							type: config.type,
							name: config.name!, // validation in toProps
							accountId: config.accountId!, // validation in toProps
						};
						return {
							...transactions,
							[newTransaction.id]: newTransaction,
						};
					},
					{}
				);
				const diffInTransaction: Transaction = state.transactions[autoDiffInId] || {
					id: makeID(),
					name: 'Auto Difference In',
					type: TransactionType.SYS_IN,
					accountId: diffAccountId,
				};
				const diffOutTransaction: Transaction = state.transactions[autoDiffOutId] || {
					id: makeID(),
					name: 'Auto Difference Out',
					type: TransactionType.SYS_OUT,
					accountId: diffAccountId,
				};
				const newTemplate: Template = {
					id: templateId,
					name: name,
					cashierAccountId: cashierAccountId,
					diffAccountId: diffAccountId,
					transactionIds: state.create.transactionIds,
					autoDiffInId: diffInTransaction.id,
					autoDiffOutId: diffOutTransaction.id,
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
						[diffInTransaction.id]: diffInTransaction,
						[diffOutTransaction.id]: diffOutTransaction,
					}),
				};
			}
			default:
				return state;
		}
	};
