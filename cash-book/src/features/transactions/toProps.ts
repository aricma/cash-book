import {ApplicationState} from '../../applicationState';
import {CreateTransactionViewProps, TransactionsViewProps, TransactionViewProps} from './props';
import {IconType} from '../../models/props';
import {dispatch} from '../../applicationState';
import {ApplicationActionType} from '../../applicationState/actions';
import {AccountType} from '../accounts/state';
import {TransactionType, Transaction} from './state';
import {compact} from '../../models/utils';


export const toTransactionsViewProps = (appState: ApplicationState, showCreateTransactionView: () => void): TransactionsViewProps => ({
    title: 'Transactions',
    create: {
        type: 'BUTTON_PROPS_TYPE',
        title: 'Create',
        icon: IconType.PLUS_FILL,
        onSelect: showCreateTransactionView,
    },
    transactions: {
        headline: ['name', 'from', 'to'],
        transactions: compact(Object
            .values(appState.transactions.transactions)
            .sort((a, b) => a.order - b.order)
            .map((transaction: Transaction): TransactionViewProps | undefined => {
                    const fromAccount = appState.accounts.accounts[transaction.fromAccountId] || undefined;
                    const toAccount = appState.accounts.accounts[transaction.toAccountId] || undefined;
                    if (fromAccount === undefined) return undefined;
                    if (toAccount === undefined) return undefined;
                    const cashStation = fromAccount.type === AccountType.CASH_STATION ? fromAccount : toAccount;
                    const direction = fromAccount.type === AccountType.CASH_STATION ? IconType.ARROW_NARROW_RIGHT_STROKE : IconType.ARROW_NARROW_LEFT_STROKE;
                    const otherAccount = fromAccount.type === AccountType.CASH_STATION ? toAccount : fromAccount;
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
                                    transactionId: transaction.id,
                                });
                            },
                        },
                    };
                },
            )),
    },
});

export const toCreateTransactionViewProps = (appState: ApplicationState, closeCreateTransactionView: () => void): CreateTransactionViewProps => {
    const validationMap = validateCreateTransaction(appState);
    const accounts = Object.values(appState.accounts.accounts);
    return ({
        title: 'Create Transaction',
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
                    type: ApplicationActionType.TRANSACTIONS_CREATE_SET_NAME,
                    value: value,
                });
            },
        },
        cashStation: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value: appState.accounts.accounts[appState.transactions.create.cashierAccountId || '']?.name || '',
            placeholder: 'set cashier account',
            validation: validationMap?.cashierAccountId,
            options: accounts.filter(({type}) => type === AccountType.CASH_STATION).map((account) => {
                return {
                    type: "BUTTON_PROPS_TYPE",
                    title: account.name,
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.TRANSACTIONS_CREATE_SET_CASHIER_ACCOUNT,
                            value: account.id,
                        });
                    },
                };
            }),
        },
        type: {
            type: 'BUTTON_PROPS_TYPE',
            icon: appState.transactions.create.type === TransactionType.OUT ? IconType.ARROW_NARROW_RIGHT_STROKE : IconType.ARROW_NARROW_LEFT_STROKE,
            title: 'Set transaction type',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_SET_TYPE,
                    value: appState.transactions.create.type === TransactionType.OUT ? TransactionType.IN : TransactionType.OUT,
                });
            },
        },
        otherAccount: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value: appState.accounts.accounts[appState.transactions.create.otherAccountId || '']?.name || '',
            placeholder: 'set other account',
            validation: validationMap?.otherAccountId,
            options: accounts.filter(({type}) => type === AccountType.DEFAULT).map((account) => {
                return {
                    type: "BUTTON_PROPS_TYPE",
                    title: account.name,
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.TRANSACTIONS_CREATE_SET_OTHER_ACCOUNT,
                            value: account.id,
                        });
                    },
                };
            }),
        },
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Cancel',
            onSelect: () => {
                closeCreateTransactionView();
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_CANCEL,
                });
            },
        },
        submit: validationMap === undefined ? {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Submit',
            onSelect: () => {
                closeCreateTransactionView();
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_SUBMIT,
                });
            },
        } : {
            type: 'DISABLED_BUTTON_PROPS_TYPE',
            title: 'Validate',
        },
    });
};

interface CreateTransactionValidationMap {
    name?: string;
    cashierAccountId?: string;
    otherAccountId?: string;
}
const validateCreateTransaction = (appState: ApplicationState): CreateTransactionValidationMap | undefined => {
    const name = !!appState.transactions.create.name ? undefined : "Name is missing!";
    const cashierAccountId = !!appState.transactions.create.cashierAccountId ? undefined : "Cashier is missing!";
    const otherAccountId = !!appState.transactions.create.otherAccountId ? undefined : "Other account is missing!";
    if (name === undefined && cashierAccountId === undefined && otherAccountId === undefined) return undefined;
    return {
        name: name,
        cashierAccountId: cashierAccountId,
        otherAccountId: otherAccountId
    };
}
