import {ApplicationState, dispatch} from '../../applicationState';
import {
    CreateTransactionViewProps,
    TransactionsViewProps,
    TransactionViewProps,
    TemplateViewProps,
    CreateTemplateViewProps,
} from './props';
import {IconType} from '../../models/props';
import {ApplicationActionType} from '../../applicationState/actions';
import {AccountType} from '../accounts/state';
import {TransactionType, Transaction, Template, CreateTransaction} from './state';
import {compact} from '../../models/utils';


export const toTransactionsViewProps = (
    appState: ApplicationState,
    showCreateTransactionView: () => void,
): TransactionsViewProps => ({
    title: 'Transactions',
    create: {
        type: 'BUTTON_PROPS_TYPE',
        title: 'Create',
        icon: IconType.PLUS_FILL,
        onSelect: showCreateTransactionView,
    },
    templates: Object.values(appState.transactions.templates).map((template) => toTemplateViewProps(appState, template)),
});

const toTemplateViewProps = (appState: ApplicationState, template: Template): TemplateViewProps => ({
    title: template.name,
    transactions: compact(Object
            .values(template.transactions)
            .map((transactionId) => appState.transactions.transactions[transactionId])
            .sort((a, b) => a.order - b.order)
            .map((transaction) => toTransactionViewProps(appState, template.id, transaction)),
    ),
});

const toTransactionViewProps = (appState: ApplicationState, templateId: string, transaction: Transaction): TransactionViewProps | undefined => {
    const fromAccount =
        appState.accounts.accounts[transaction.fromAccountId] || undefined;
    const toAccount =
        appState.accounts.accounts[transaction.toAccountId] || undefined;
    if (fromAccount === undefined) return undefined;
    if (toAccount === undefined) return undefined;
    const cashStation =
        fromAccount.type === AccountType.CASH_STATION
            ? fromAccount
            : toAccount;
    const direction =
        fromAccount.type === AccountType.CASH_STATION
            ? IconType.ARROW_NARROW_RIGHT_STROKE
            : IconType.ARROW_NARROW_LEFT_STROKE;
    const otherAccount =
        fromAccount.type === AccountType.CASH_STATION
            ? toAccount
            : fromAccount;
    return {
        order: transaction.order + '.',
        title: transaction.name,
        cashStation: {
            title: cashStation.name,
        },
        direction: direction,
        otherAccount: {
            title: otherAccount.name,
        },
        decreaseOrder: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CHEVRON_UP_FILL,
            title: 'Decrease Order',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_ORDER_DEC,
                    templateId: templateId,
                    transactionId: transaction.id,
                });
            },
        },
        increaseOrder: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CHEVRON_DOWN_FILL,
            title: 'Increase Order',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_ORDER_INC,
                    templateId: templateId,
                    transactionId: transaction.id,
                });
            },
        },
    };
};

export const toCreateTemplateViewProps = (
    appState: ApplicationState,
    closeCreateTransactionView: () => void
): CreateTemplateViewProps => {
    const validationMap = validateCreateTemplate(appState);
    return {
        title: 'Create Transaction Template',
        close: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Close',
            icon: IconType.CLOSE_FILL,
            onSelect: closeCreateTransactionView,
        },
        name: {
            type: 'TEXT_INPUT_PROPS_TYPE',
            value: appState.transactions.create.name || '',
            placeholder: 'Name',
            validation: validationMap?.name,
            onChange: (value) => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_NAME,
                    name: value,
                });
            },
        },
        cashierAccount: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value:
                appState.accounts.accounts[
                appState.transactions.create.cashierAccountId || ''
                    ]?.name || '',
            placeholder: 'set cashier account',
            validation: validationMap?.cashierAccountId,
            options: Object.values(appState.accounts.accounts)
                .filter(({type}) => type === AccountType.CASH_STATION)
                .map((account) => {
                    return {
                        type: 'BUTTON_PROPS_TYPE',
                        title: account.name,
                        onSelect: () => {
                            dispatch({
                                type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_CASHIER_ACCOUNT,
                                cashierAccountId: account.id,
                            });
                        },
                    };
                }),
        },
        diffAccount: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value:
                appState.accounts.accounts[
                appState.transactions.create.diffAccountId || ''
                    ]?.name || '',
            placeholder: 'set difference account',
            validation: validationMap?.diffAccountId,
            options: Object.values(appState.accounts.accounts)
                .filter(({type}) => type === AccountType.DIFFERENCE)
                .map((account) => {
                    return {
                        type: 'BUTTON_PROPS_TYPE',
                        title: account.name,
                        onSelect: () => {
                            dispatch({
                                type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SET_DIFF_ACCOUNT,
                                diffAccountId: account.id,
                            });
                        },
                    };
                }),
        },
        transactions: validationMap?.cashierAccountId === undefined ? Object.values(appState.transactions.create.transactions).sort((a, b) => a.order - b.order).map((transactionConfig) => toCreateTransactionViewProps(appState, transactionConfig)) : undefined,
        addTransaction: validationMap?.cashierAccountId === undefined ? {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.PLUS_FILL,
            title: 'Add Transaction',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
                });
            },
        } : undefined,
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Cancel',
            onSelect: () => {
                closeCreateTransactionView();
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_CANCEL,
                });
            },
        },
        submit:
            validationMap === undefined
                ? {
                    type: 'BUTTON_PROPS_TYPE',
                    title: 'Submit',
                    onSelect: () => {
                        closeCreateTransactionView();
                        dispatch({
                            type: ApplicationActionType.TRANSACTIONS_CREATE_TEMPLATE_SUBMIT,
                        });
                    },
                }
                : {
                    type: 'DISABLED_BUTTON_PROPS_TYPE',
                    title: 'Validate',
                },
    };
};

interface CreateTemplateValidationMap {
    name?: string;
    cashierAccountId?: string;
    diffAccountId?: string;
}

const validateCreateTemplate = (
    appState: ApplicationState,
): CreateTemplateValidationMap | undefined => {
    const name = !!appState.transactions.create.name
        ? undefined
        : 'Name is missing!';
    const cashierAccountId = !!appState.transactions.create.cashierAccountId
        ? undefined
        : 'Cashier is missing!';
    const diffAccountId = !!appState.transactions.create.diffAccountId
        ? undefined
        : 'Other account is missing!';
    if (
        name === undefined &&
        cashierAccountId === undefined &&
        diffAccountId === undefined
    )
        return undefined;
    return {
        name: name,
        cashierAccountId: cashierAccountId,
        diffAccountId: diffAccountId,
    };
};

const toCreateTransactionViewProps = (appState: ApplicationState, transaction: CreateTransaction): CreateTransactionViewProps => {
    const validationMap = validateCreateTransaction(transaction);
    return {
        order: transaction.order + ".",
        name: {
            type: 'TEXT_INPUT_PROPS_TYPE',
            value: transaction.name || '',
            placeholder: 'Name',
            validation: validationMap?.name,
            onChange: (value) => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_NAME,
                    transactionId: transaction.id,
                    name: value,
                });
            },
        },
        cashierAccount: appState.accounts.accounts[appState.transactions.create.cashierAccountId || ""]?.name || "",
        type: {
            type: 'BUTTON_PROPS_TYPE',
            icon: transaction.type === TransactionType.OUT
                    ? IconType.ARROW_NARROW_RIGHT_STROKE
                    : IconType.ARROW_NARROW_LEFT_STROKE,
            title: 'Set transaction type',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_TYPE,
                    transactionId: transaction.id,
                    transactionType: transaction.type === TransactionType.OUT
                            ? TransactionType.IN
                            : TransactionType.OUT,
                });
            },
        },
        account: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value: appState.accounts.accounts[transaction.accountId || '']?.name || '',
            placeholder: 'set other account',
            validation: validationMap?.accountId,
            options: Object.values(appState.accounts.accounts)
                .filter(({type}) => type === AccountType.DEFAULT)
                .map((account) => {
                    return {
                        type: 'BUTTON_PROPS_TYPE',
                        title: account.name,
                        onSelect: () => {
                            dispatch({
                                type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_SET_ACCOUNT,
                                transactionId: transaction.id,
                                accountId: account.id,
                            });
                        },
                    };
                }),
        },
        remove: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CLOSE_FILL,
            title: 'Remove',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_REMOVE,
                    transactionId: transaction.id,
                });
            },
        },
        decreaseOrder: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CHEVRON_UP_FILL,
            title: 'Decrease Order',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_DEC,
                    transactionId: transaction.id,
                });
            },
        },
        increaseOrder: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CHEVRON_DOWN_FILL,
            title: 'Increase Order',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_ORDER_INC,
                    transactionId: transaction.id,
                });
            },
        },
    };
};

interface CreateTransactionValidationMap {
    name?: string;
    accountId?: string;
}

const validateCreateTransaction = (
    transaction: CreateTransaction
): CreateTransactionValidationMap | undefined => {
    const name = !!transaction.name
        ? undefined
        : 'Name is missing!';
    const accountId = !!transaction.accountId
        ? undefined
        : 'Account is missing!';
    if (
        name === undefined &&
        accountId === undefined
    )
        return undefined;
    return {
        name: name,
        accountId: accountId,
    };
};
