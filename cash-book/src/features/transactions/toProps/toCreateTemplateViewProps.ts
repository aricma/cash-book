import {ApplicationState, dispatch} from '../../../applicationState';
import {CreateTemplateViewProps} from '../props/createTemplateViewProps';
import {validateCreateTemplate} from './validation';
import {IconType} from '../../../models/props';
import {ApplicationActionType} from '../../../applicationState/actions';
import {AccountType} from '../../accounts/state';
import {toCreateTransactionViewProps} from './toCreateTransactionViewProps';


export const toCreateTemplateViewProps = (
    appState: ApplicationState,
    closeCreateTransactionView: () => void,
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
            value: appState.accounts.accounts[appState.transactions.create.cashierAccountId || '']?.name || '',
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
            value: appState.accounts.accounts[appState.transactions.create.diffAccountId || '']?.name || '',
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
        transactions:
            validationMap?.cashierAccountId === undefined
                ? appState.transactions.create.transactionIds.map((transactionId, index) => {
                    const transaction = appState.transactions.create.transactions[transactionId];
                    return toCreateTransactionViewProps(appState, index + 1, transaction);
                })
                : undefined,
        addTransaction:
            validationMap?.cashierAccountId === undefined
                ? {
                    type: 'BUTTON_PROPS_TYPE',
                    icon: IconType.PLUS_FILL,
                    title: 'Add Transaction',
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
                        });
                    },
                }
                : undefined,
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
