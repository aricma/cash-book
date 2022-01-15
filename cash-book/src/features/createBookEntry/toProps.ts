import {AccountType} from '../accounts/state';
import {ApplicationActionType} from '../../applicationState/actions';
import {
    CreateBookEntryViewProps,
    OverrideDateConfirmationModalViewProps,
    CreateBookEntryTemplateConfigProps,
} from './props';
import {ApplicationState, dispatch} from '../../applicationState';
import {DateWithoutTime} from '../../models/domain/date';
import {compact, toNumber, subtractDays} from '../../models/utils';
import {IconType} from '../../models/props';


interface ToCreateBookEntryViewPropsRequest {
    appState: ApplicationState,
    showValidation: boolean,
    setShowValidation: () => void,
    openDateOverrideConfirmationModal: () => void,
}
export const toCreateBookEntryViewProps = (req: ToCreateBookEntryViewPropsRequest): CreateBookEntryViewProps => {

    return {
        title: 'New Book Entry',
        template: {
            type: 'OPTIONS_INPUT_PROPS_TYPE',
            value: req.appState.transactions.templates[req.appState.bookEntries.create.selectedTemplateId || ""]?.name || "",
            placeholder: 'Set transaction template',
            options: Object.values(req.appState.transactions.templates).map((template) => ({
                type: 'BUTTON_PROPS_TYPE',
                title: template.name,
                onSelect: () => {
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
                        templateId: template.id
                    })
                }
            }))
        },
        templateConfig: toTemplateConfigProps(req),
    }
};

interface ToTemplateConfigPropsRequest {
    appState: ApplicationState,
    showValidation: boolean,
    setShowValidation: () => void,
    openDateOverrideConfirmationModal: () => void,
}

export const toTemplateConfigProps = (req: ToTemplateConfigPropsRequest): CreateBookEntryTemplateConfigProps | undefined => {
    const templateConfig = req.appState.bookEntries.create.templates[req.appState.bookEntries.create.selectedTemplateId || ""];
    if (templateConfig === undefined) return undefined;
    const validationMap = validateCreateBookEntry(req.appState);
    console.log(validationMap);
    const needsDateOverrideConfirmation = validateIfDateExists(req.appState) !== undefined;
    const dateDisplay = DateWithoutTime.fromString(templateConfig.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return {
        date: {
            input: {
                type: 'DATE_PICKER_INPUT_PROPS',
                label: dateDisplay,
                value: templateConfig.date,
                onChange: (date) => {
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
                        templateId: templateConfig.templateId,
                        date: date,
                    });
                },
            },
            today: {
                type: 'BUTTON_PROPS_TYPE',
                title: 'Today',
                onSelect: () => {
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
                        templateId: templateConfig.templateId,
                        date: DateWithoutTime.new().toISOString(),
                    });
                },
            },
            yesterday: {
                type: 'BUTTON_PROPS_TYPE',
                title: 'Yesterday',
                onSelect: () => {
                    const today = DateWithoutTime.new();
                    const yesterday = subtractDays(today, 1);
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
                        templateId: templateConfig.templateId,
                        date: yesterday.toISOString(),
                    });
                },
            },
        },
        transactions: Object.values(req.appState.transactions.templates[templateConfig.templateId].transactions)
            .map((transactionsId) => req.appState.transactions.transactions[transactionsId])
            .sort((a, b) => {
                return a.order - b.order;
            })
            .map((transaction) => {
                return {
                    type: 'TEXT_INPUT_PROPS_TYPE',
                    label: transaction.name,
                    value: templateConfig.transactions[transaction.id] || '',
                    placeholder: '',
                    validation: req.showValidation ? validationMap?.transactions === undefined ? undefined : validationMap?.transactions[transaction.id] : undefined,
                    onChange: (value) => {
                        if (/^[\d.]*$/.test(value)) {
                            dispatch({
                                type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
                                templateId: templateConfig.templateId,
                                transactionId: transaction.id,
                                value: value,
                            });
                        }
                    },
                };
            }),
        addTransaction: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.PLUS_FILL,
            title: 'Add Transaction',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.TRANSACTIONS_CREATE_TRANSACTION_ADD,
                });
            },
        },
        valueValidation: req.showValidation ? validationMap?.value : undefined,
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Cancel',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
                    templateId: templateConfig.templateId,
                });
            },
        },
        submit:
            validationMap === undefined
                ? needsDateOverrideConfirmation
                    ? {
                        type: 'BUTTON_PROPS_TYPE',
                        title: 'Submit',
                        onSelect: () => {
                            req.openDateOverrideConfirmationModal();
                        },
                    }
                    : {
                        type: 'BUTTON_PROPS_TYPE',
                        title: 'Submit',
                        onSelect: () => {
                            dispatch({
                                type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
                                templateId: templateConfig.templateId,
                            });
                        },
                    }
                : {
                    type: 'BUTTON_PROPS_TYPE',
                    title: 'Validate',
                    onSelect: () => {
                        req.setShowValidation();
                    },
                },
    };
};

export const toOverrideDateConfirmationModalViewProps = (
    appState: ApplicationState,
    closeModal: () => void,
): OverrideDateConfirmationModalViewProps | undefined => {
    const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.create.selectedTemplateId || ""];
    if (templateConfig === undefined) return undefined;
    const dateDisplay = DateWithoutTime.fromString(templateConfig.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return {
        title: 'Date already exists!',
        message: `Do you really want to override this date?(${dateDisplay})`,
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'No',
            onSelect: () => {
                closeModal();
            },
        },
        submit: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Yes',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
                    templateId: templateConfig.templateId,
                });
                closeModal();
            },
        },
    };
};

interface CreateBookEntryValidationMap {
    transactions?: {
        [transactionId: string]: string | undefined;
    };
    value?: string;
}

const validateCreateBookEntry = (
    appState: ApplicationState,
): CreateBookEntryValidationMap | undefined => {
    const transactions = validateTransactions(appState);
    const value = validateTransactionValue(appState);

    const hasAllTransactions = transactions === undefined;
    const isBalanced = value === undefined;
    if (hasAllTransactions && isBalanced) return undefined;

    return {
        transactions: transactions,
        value: value,
    };
};

const validateIfDateExists = (
    appState: ApplicationState,
): string | undefined => {
    const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.create.selectedTemplateId || ""];
    if (templateConfig === undefined) return undefined;
    return Object.keys(appState.bookEntries.entries).includes(templateConfig.date) ? 'Date already exists!' : undefined;
};

const validateTransactions = (
    appState: ApplicationState,
): { [transactionId: string]: string | undefined } | undefined => {
    const template = appState.transactions.templates[appState.bookEntries.create.selectedTemplateId || ""];
    const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.create.selectedTemplateId || ""];
    if (template === undefined) return undefined;
    if (templateConfig === undefined) return undefined;
    const map = template.transactions.reduce((map, transactionId) => {
        const value = templateConfig.transactions[appState.bookEntries.create.selectedTemplateId || ""];
        return {
            ...map,
            [transactionId]: !!value ? undefined : 'Transaction is missing!',
        };
    }, {});
    if (compact(Object.values(map)).length === 0) return undefined;
    return map;
};

const validateTransactionValue = (
    appState: ApplicationState,
): string | undefined => {
    const templateConfig = appState.bookEntries.create.templates[appState.bookEntries.create.selectedTemplateId || ""];
    if (templateConfig === undefined) return undefined;
    const cashierAccount =
        Object.values(appState.accounts.accounts).find(({type}) => {
            return type === AccountType.CASH_STATION;
        }) || undefined;
    if (cashierAccount === undefined) return 'Cashier account is missing!';
    const differenceAccount =
        Object.values(appState.accounts.accounts).find(({type}) => {
            return type === AccountType.DIFFERENCE;
        }) || undefined;
    if (differenceAccount === undefined) return 'Difference account is missing!';

    const requiredTransactionIds = Object.keys(
        appState.transactions.transactions,
    );
    const value = requiredTransactionIds.reduce((value, transactionId) => {
        const transaction = appState.transactions.transactions[transactionId];
        const transactionValue =
            toNumber(templateConfig.transactions[transactionId]) || 0;
        if (transaction.fromAccountId === cashierAccount.id) {
            return value - transactionValue;
        } else {
            return value + transactionValue;
        }
    }, 0);
    return value === 0 ? undefined : 'Transactions result to ' + value + '!';
};
