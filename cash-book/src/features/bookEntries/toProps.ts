import {ApplicationState, dispatch} from '../../applicationState';
import {IconType, ButtonProps, OptionsInputProps} from '../../models/props';
import {ApplicationActionType} from '../../applicationState/actions';
import {BookEntry} from './state';
import {
    BookEntriesViewProps,
    BookEntryDayViewProps,
    DataBookEntryViewProps,
    ErrorBookEnrtyViewProps,
    BookEntryMonthViewProps,
} from './props';
import {TransactionType} from '../transactions/state';
import {TransactionWithValue, accountWithValue} from './misc';
import {ROUTES_CREATE_BOOK_ENTRY} from '../../variables/routes';
import {DateWithoutTime} from '../../models/domain/date';
import {pad, compact} from '../../models/utils';


export const toBookingsViewProps = (appState: ApplicationState): BookEntriesViewProps => {
    const title = 'Book Entries';
    const createButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create',
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_CREATE_BOOK_ENTRY,
            });
        },
    };
    const template = appState.transactions.templates[appState.bookEntries.selectedTemplateId || ''];
    const templateSelect: OptionsInputProps = {
        type: 'OPTIONS_INPUT_PROPS_TYPE',
        value: template?.name || '',
        placeholder: 'set template',
        options: compact(
            Object.keys(appState.transactions.templates).map((templateId): ButtonProps | undefined => {
                const template = appState.transactions.templates[templateId];
                if (template === undefined) return undefined;
                return {
                    type: 'BUTTON_PROPS_TYPE',
                    title: template.name,
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE,
                            templateId: templateId,
                        });
                    },
                };
            }),
        ),
    };
    if (template === undefined) {
        return {
            title: title,
            create: createButton,
            template: templateSelect,
            accounts: [],
            entries: [],
        };
    }
    const entries = appState.bookEntries.templates[template.id] || {};
    const differenceAccount = appState.accounts.accounts[template.diffAccountId];
    const differenceTransactions = Object.values(entries).reduce((transactions: Array<TransactionWithValue>, bookEntry) => {
        return [
            ...transactions,
            ...Object.entries(bookEntry.transactions).map(([transactionId, value]): TransactionWithValue => ({
                ...appState.transactions.transactions[transactionId],
                value: String(value),
            })),
        ];
    }, []).filter((transaction) => transaction.accountId !== template.diffAccountId);
    return ({
        title: title,
        create: createButton,
        template: templateSelect,
        accounts: [accountWithValue(differenceAccount, differenceTransactions)].map((accountWithValue) => {
            return {
                title: accountWithValue.name,
                number: accountWithValue.number,
                value: accountWithValue.value,
            };
        }),
        entries: Object.values(
            Object.values(entries)
                .filter((bookEntry) => bookEntry.templateId === appState.bookEntries.selectedTemplateId)
                .sort((a, b) => {
                    const dateA = DateWithoutTime.fromString(a.date).getTime();
                    const dateB = DateWithoutTime.fromString(b.date).getTime();
                    return dateB - dateA;
                })
                .reduce((bookEntries: { [yearAndMonth: string]: BookEntryMonthViewProps }, bookEntry) => {
                    const yearAndMonth = toYearAndMonth(bookEntry.date);
                    const dayEntry = toBookEntryDayViewProps(appState, bookEntry);
                    const hasMonth = bookEntries[yearAndMonth] !== undefined;
                    if (hasMonth) {
                        return {
                            ...bookEntries,
                            [yearAndMonth]: {
                                ...bookEntries[yearAndMonth],
                                entries: [...bookEntries[yearAndMonth].entries, dayEntry],
                            },
                        };
                    } else {
                        return {
                            ...bookEntries,
                            [yearAndMonth]: toBookEntryMonthViewProps(appState, bookEntry),
                        };
                    }
                }, {}),
        ),
    });
};

const toYearAndMonth = (value: string) => {
    const date = DateWithoutTime.fromString(value);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    return year + '-' + month;
};

const toBookEntryMonthViewProps = (appState: ApplicationState, bookEntry: BookEntry): BookEntryMonthViewProps => {
    return {
        date: DateWithoutTime.fromString(bookEntry.date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
        }),
        export: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.DOWNLOAD_FILL,
            title: 'Export',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_EXPORT_MONTH,
                    date: bookEntry.date,
                });
            },
        },
        entries: [toBookEntryDayViewProps(appState, bookEntry)],
    };
};

const toBookEntryDayViewProps = (appState: ApplicationState, bookEntry: BookEntry): BookEntryDayViewProps => {
    return {
        date: DateWithoutTime.fromString(bookEntry.date).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        export: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.DOWNLOAD_FILL,
            title: 'Export',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_EXPORT_DAY,
                    date: bookEntry.date,
                });
            },
        },
        entries: toBookEntryViewProps(appState, bookEntry),
    };
};

const toBookEntryViewProps = (appState: ApplicationState, bookEntry: BookEntry) => {
    const template = appState.transactions.templates[bookEntry.templateId];
    return Object.entries(bookEntry.transactions).map(
        ([transactionId, value]): DataBookEntryViewProps | ErrorBookEnrtyViewProps => {
            const transaction = appState.transactions.transactions[transactionId];
            if (transaction === undefined)
                return {
                    type: 'ERROR_BOOKING_VIEW_PROPS',
                    message: 'No transaction or id: ' + transactionId,
                };
            const cashierAccount = appState.accounts.accounts[template.cashierAccountId];
            if (cashierAccount === undefined)
                return {
                    type: 'ERROR_BOOKING_VIEW_PROPS',
                    message: 'No account for id: ' + template.cashierAccountId,
                };
            const otherAccount = appState.accounts.accounts[transaction.accountId];
            if (otherAccount === undefined)
                return {
                    type: 'ERROR_BOOKING_VIEW_PROPS',
                    message: 'No account for id: ' + transaction.accountId,
                };
            return {
                type: 'DATA_BOOKING_VIEW_PROPS',
                date: DateWithoutTime.fromString(bookEntry.date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                title: transaction.name,
                cashierAccount: cashierAccount.name,
                direction: (() => {
                    switch (transaction.type) {
                        case TransactionType.IN:
                        case TransactionType.SYS_IN:
                            return IconType.ARROW_NARROW_LEFT_STROKE;
                        case TransactionType.OUT:
                        case TransactionType.SYS_OUT:
                            return IconType.ARROW_NARROW_RIGHT_STROKE;
                    }
                })(),
                otherAccount: otherAccount.name,
                value: String(value),
            };
        },
    );
};
