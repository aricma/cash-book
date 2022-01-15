import hash from 'crypto-js/sha1';
import {Reducer} from '../../models/reducers';
import {TransactionsState, Transaction, TransactionType, Template, CreateTransaction} from './state';
import {TransactionsAction, ApplicationActionType} from '../../applicationState/actions';
import {compactObject, compact} from '../../models/utils';


export const reducer: Reducer<TransactionsState, TransactionsAction> = (
    state,
    action,
) => {
    switch (action.type) {
        case ApplicationActionType.TRANSACTIONS_SET:
            return action.state;
        case ApplicationActionType.TRANSACTIONS_EDIT: {
            const template = state.templates[action.templateId];
            if (template === undefined) return state;
            interface CreateConfig {
                diffAccountId?: string,
                cashierAccountId?: string,
                transactions: {
                    [transactionId:string]: CreateTransaction
                }
            }
            const data = template.transactions.reduce((data: CreateConfig, transactionId) => {
                const transaction = state.transactions[transactionId];
                const cashierAccountId = transaction.type === TransactionType.IN ? transaction.toAccountId: transaction.fromAccountId;
                const otherAccountId = transaction.type === TransactionType.IN ? transaction.fromAccountId: transaction.toAccountId;
                return {
                    ...data,
                    cashierAccountId: cashierAccountId,
                    transactions: {
                        ...data.transactions,
                        [transaction.id]: {
                            id: transaction.id,
                            type: transaction.type,
                            order: transaction.order,
                            name: transaction.name,
                            accountId: otherAccountId,
                        }
                    }
                }
            }, { transactions: {} })
            return {
                ...state,
                create: {
                    id: template.id,
                    name: template.name,
                    cashierAccountId: data.cashierAccountId,
                    diffAccountId: data.diffAccountId,
                    transactions: data.transactions,
                }
            }
        }
        case ApplicationActionType.TRANSACTIONS_ORDER_INC: {
            const template = state.templates[action.templateId];
            const transaction = state.transactions[action.transactionId];
            if (template === undefined) return state;
            if (transaction === undefined) return state;
            const nextTransaction =
                compact(template.transactions.map((transactionId) => state.transactions[transactionId])).find(
                    ({order}) => order === transaction.order + 1,
                ) || undefined;
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
                    },
                },
            };
        }
        case ApplicationActionType.TRANSACTIONS_ORDER_DEC: {
            const template = state.templates[action.templateId];
            const transaction = state.transactions[action.transactionId];
            if (template === undefined) return state;
            if (transaction === undefined) return state;
            const prevTransaction =
                compact(template.transactions.map((transactionId) => state.transactions[transactionId])).find(
                    ({order}) => order === transaction.order - 1,
                ) || undefined;
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
                    },
                },
            };
        }
        case ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC: {
            const transaction = state.create.transactions[action.transactionId];
            if (transaction === undefined) return state;
            const prevTransaction =
                Object.values(state.create.transactions).find(
                    ({order}) => order === transaction.order - 1,
                ) || undefined;
            if (prevTransaction === undefined) return state;
            return {
                ...state,
                create: {
                    ...state.create,
                    transactions: {
                        ...state.create.transactions,
                        [prevTransaction.id]: {
                            ...prevTransaction,
                            order: prevTransaction.order + 1,
                        },
                        [transaction.id]: {
                            ...transaction,
                            order: transaction.order - 1,
                        },
                    },
                },
            };
        }
        case ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC:
            const transaction = state.create.transactions[action.transactionId];
            if (transaction === undefined) return state;
            const nextTransaction =
                Object.values(state.create.transactions).find(
                    ({order}) => order === transaction.order + 1,
                ) || undefined;
            if (nextTransaction === undefined) return state;
            return {
                ...state,
                create: {
                    ...state.create,
                    transactions: {
                        ...state.create.transactions,
                        [nextTransaction.id]: {
                            ...nextTransaction,
                            order: nextTransaction.order - 1,
                        },
                        [transaction.id]: {
                            ...transaction,
                            order: transaction.order + 1,
                        },
                    },
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
            const allTransactions = Object.values(state.create.transactions);
            const lastIndex = allTransactions.length - 1;
            const getLastOrderNumber = (allTransactions
                .map(({order}) => order)
                .sort((a, b) => a - b)
            )[lastIndex] || 0;
            return {
                ...state,
                create: {
                    ...state.create,
                    transactions: {
                        ...state.create.transactions,
                        [transactionId]: {
                            id: transactionId,
                            type: TransactionType.OUT,
                            order: getLastOrderNumber + 1,
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
                    transactions: {},
                },
            };
        case ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT: {
            const templateId = state.create.id || hash(new Date().toISOString()).toString();
            if (state.create.name === undefined) return state;
            const newTransactions = compactObject(Object.fromEntries(Object.values(state.create.transactions).map((config): [transactionId: string, transaction: Transaction | undefined] => {
                if (config.accountId === undefined) return [config.id, undefined];
                if (config.name === undefined) return [config.id, undefined];
                if (state.create.cashierAccountId === undefined) return [config.id, undefined];
                if (state.create.diffAccountId === undefined) return [config.id, undefined];
                const fromAccountId = config.type === TransactionType.OUT ? state.create.cashierAccountId : config.accountId;
                const toAccountId = config.type === TransactionType.IN ? state.create.cashierAccountId : config.accountId;
                return [config.id, {
                    id: config.id,
                    order: config.order,
                    type: config.type,
                    name: config.name,
                    fromAccountId: fromAccountId,
                    toAccountId: toAccountId,
                }];
            })));
            const newTemplate: Template = {
                id: templateId,
                name: state.create.name,
                transactions: Object.values(newTransactions).map((transaction) => transaction.id),
            };
            return {
                ...state,
                create: {
                    transactions: {},
                },
                templates: {
                    ...state.templates,
                    [templateId]: newTemplate,
                },
                transactions: {
                    ...state.transactions,
                    ...newTransactions,
                },
            };
        }
        default:
            return state;
    }
};
