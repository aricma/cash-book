import {ApplicationState, dispatch} from '../../../applicationState';
import {CreateBookEntryTemplateConfigProps} from '../props';
import {validateCreateBookEntry, validateIfDateExists} from './validation';
import {transactionValue} from '../../bookEntries/misc';
import {DateWithoutTime} from '../../../models/domain/date';
import {ApplicationActionType} from '../../../applicationState/actions';
import {subtractDays} from '../../../models/utils';
import {cashInformationParser, transactionParser} from '../../../misc/parser';
import {IconType} from '../../../models/props';
import {ROUTES_BOOK_ENTRIES} from '../../../variables/routes';


interface ToTemplateConfigPropsRequest {
    appState: ApplicationState;
    showValidation: boolean;
    setShowValidation: () => void;
    openDateOverrideConfirmationModal: () => void;
}

export const toTemplateConfigProps = (
    req: ToTemplateConfigPropsRequest,
): CreateBookEntryTemplateConfigProps => {
    const selectedTemplateId = req.appState.bookEntries.selectedTemplateId || "";
    const config = req.appState.bookEntries.create.templates[selectedTemplateId];
    const template = req.appState.transactions.templates[selectedTemplateId];
    const validationMap = validateCreateBookEntry(req.appState);
    const diffValue = transactionValue(req.appState);
    const cashierAccount = req.appState.accounts.accounts[template.cashierAccountId];
    const diffAccount = req.appState.accounts.accounts[template.diffAccountId];
    const needsDateOverrideConfirmation = validateIfDateExists(req.appState) !== undefined;
    const dateDisplay = DateWithoutTime.fromString(config.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const textInputChangeHandler = (value: string): string | null => {
        if (/^$ | ^[^\d.,\b]*$/.test(value)) return null;
        return value;
    };
    return {
        date: {
            input: {
                type: 'DATE_PICKER_INPUT_PROPS',
                label: dateDisplay,
                value: config.date,
                onChange: (date) => {
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DATE,
                        templateId: config.templateId,
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
                        templateId: config.templateId,
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
                        templateId: config.templateId,
                        date: yesterday.toISOString(),
                    });
                },
            },
        },
        cashStart: {
            type: 'TEXT_INPUT_PROPS_TYPE',
            label: 'Cash Station: Start Value',
            value: config.cash.start,
            placeholder: '',
            onFinish: (value) => {
                const newValue = cashInformationParser(value);
                if (newValue === value) return;
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
                    templateId: config.templateId,
                    value: newValue,
                });
            },
            onChange: (value) => {
                const newValue = textInputChangeHandler(value);
                if (newValue === null) return;
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_START,
                    templateId: config.templateId,
                    value: newValue,
                });
            },
        },
        cashEnd: {
            type: 'TEXT_INPUT_PROPS_TYPE',
            label: 'Cash Station: End Value',
            value: config.cash.end,
            placeholder: '',
            onFinish: (value) => {
                const newValue = cashInformationParser(value);
                if (newValue === value) return;
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
                    templateId: config.templateId,
                    value: newValue,
                });
            },
            onChange: (value) => {
                const newValue = textInputChangeHandler(value);
                if (newValue === null) return;
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_CASH_END,
                    templateId: config.templateId,
                    value: newValue,
                });
            },
        },
        transactions: template.transactions.map((transactionsId) => {
            const transaction = req.appState.transactions.transactions[transactionsId];
            return {
                type: 'TEXT_INPUT_PROPS_TYPE',
                label: transaction.name,
                value: config.transactions[transaction.id] || '',
                placeholder: '',
                validation: req.showValidation
                    ? validationMap?.transactions === undefined
                        ? undefined
                        : validationMap?.transactions[transaction.id]
                    : undefined,
                onFinish: (value) => {
                    const newValue = transactionParser(value);
                    if (newValue === value) return;
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
                        templateId: config.templateId,
                        transactionId: transaction.id,
                        value: newValue,
                    });
                },
                onChange: (value) => {
                    const newValue = textInputChangeHandler(value);
                    if (newValue === null) return;
                    dispatch({
                        type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TRANSACTION,
                        templateId: config.templateId,
                        transactionId: transaction.id,
                        value: newValue,
                    });
                },
            };
        }),
        diffTransaction:
            diffValue !== 0
                ? {
                    title: 'Difference Transaction',
                    cashierAccount: cashierAccount.name,
                    direction: diffValue < 0 ? IconType.ARROW_NARROW_LEFT_STROKE : IconType.ARROW_NARROW_RIGHT_STROKE,
                    diffAccount: diffAccount.name,
                    value: '' + Math.abs(diffValue),
                    description:
                        'If you enable this transaction we automatically move the remainder of the aggregated transactions into the difference account',
                    input: {
                        type: 'BOOLEAN_INPUT_PROPS_TYPE',
                        title: 'Toggle Diff Account',
                        value: config.diffTransaction !== undefined,
                        validation: config.diffTransaction === undefined ? validationMap?.value : undefined,
                        onChange: () => {
                            if (config.diffTransaction === undefined) {
                                const transactionId = diffValue < 0 ? template.autoDiffInId : template.autoDiffOutId;
                                dispatch({
                                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DIFF_TRANSACTION,
                                    transaction: {transactionId, value: String(Math.abs(diffValue))},
                                });
                            } else {
                                dispatch({type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_DIFF_TRANSACTION});
                            }
                        },
                    },
                }
                : undefined,
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Cancel',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_CANCEL,
                    templateId: config.templateId,
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
                                templateId: config.templateId,
                            });
                            dispatch({
                                type: ApplicationActionType.ROUTER_GO_TO,
                                path: ROUTES_BOOK_ENTRIES,
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
