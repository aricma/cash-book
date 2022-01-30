import {ApplicationState, dispatch} from '../../../applicationState';
import {BookEntry} from '../state';
import {TransactionType, Transaction} from '../../transactions/state';
import {BookEntryDayViewProps, DataBookEntryViewProps, ErrorBookEnrtyViewProps} from '../props';
import {DateWithoutTime} from '../../../models/domain/date';
import {IconType} from '../../../models/props';
import {ApplicationActionType} from '../../../applicationState/actions';
import {ROUTES_CREATE_BOOK_ENTRY} from '../../../variables/routes';
import {toCurrencyInt} from '../../../models/currencyInt';


export const toBookEntryDayViewProps = (appState: ApplicationState, bookEntry: BookEntry): BookEntryDayViewProps => {
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
                    type: ApplicationActionType.APPLICATION_EXPORT,
                    exportPayloadType: 'EXPORT_PAYLOAD_TYPE/BOOK_ENTRIES',
                    dataType: 'book-entries',
                    fileType: 'datev',
                    range: 'day',
                    date: bookEntry.date,
                });
            },
        },
        edit: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.PENCIL_ALT_FILL,
            title: 'Edit',
            onSelect: () => {
                const hasCreateStateForTemplateId = !!appState.bookEntries.create.templates[bookEntry.templateId];
                const userConfirmation = hasCreateStateForTemplateId && window.confirm(OVERWRITE_CREATE_STATE_CONFIRM_MESSAGE);
                if (hasCreateStateForTemplateId && !userConfirmation) return;
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_EDIT,
                    templateId: bookEntry.templateId,
                    date: bookEntry.date,
                });
                dispatch({
                    type: ApplicationActionType.ROUTER_GO_TO,
                    path: ROUTES_CREATE_BOOK_ENTRY,
                });
            },
        },
        cashInfo: {
            start: bookEntry.cash.start,
            add: toAddInfo(appState, bookEntry),
            subtract: toSubtractInfo(appState, bookEntry).replace('-', '- '),
            end: bookEntry.cash.end,
            diff: toDiffInfo(appState, bookEntry),
        },
        entries: toBookEntryViewProps(appState, bookEntry),
    };
};

const toBookEntryViewProps = (appState: ApplicationState, bookEntry: BookEntry) => {
    const template = appState.transactions.templates[bookEntry.templateId];
    return Object.entries(bookEntry.transactions)
        .map(([transactionId, value]): Transaction & { order: number; value: string } => ({
            ...(appState.transactions.transactions[transactionId] || {}),
            order: template.transactions.indexOf(transactionId) || 0,
            value: value,
        }))
        .sort((a, b) => {
            if (a.order === -1) return 1;
            if (b.order === -1) return -1;
            return a.order - b.order;
        })
        .map((extendedTransaction): DataBookEntryViewProps | ErrorBookEnrtyViewProps => {
            const {id: transactionId, value, ...transaction} = extendedTransaction;
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
        });
};

export const toAddInfo = (appState: ApplicationState, bookEntry: BookEntry): string => {
    return String(
        Object.entries(bookEntry.transactions).reduce((addInfo: number, [transactionId, value]) => {
            const transaction = appState.transactions.transactions[transactionId];
            if (transaction === undefined) return addInfo;
            switch (transaction.type) {
                case TransactionType.IN:
                    return addInfo + toNumberOrZero(value);
                default:
                    return addInfo;
            }
        }, 0) / 100,
    );
};
export const toSubtractInfo = (appState: ApplicationState, bookEntry: BookEntry): string => {
    return String(
        Object.entries(bookEntry.transactions).reduce((subInfo: number, [transactionId, value]) => {
            const transaction = appState.transactions.transactions[transactionId];
            if (transaction === undefined) return subInfo;
            switch (transaction.type) {
                case TransactionType.OUT:
                    return subInfo - toNumberOrZero(value);
                default:
                    return subInfo;
            }
        }, 0) / 100,
    );
};
export const toDiffInfo = (appState: ApplicationState, bookEntry: BookEntry): string => {
    const aggregatedEnd = Object.entries(bookEntry.transactions).reduce((diffInfo: number, [transactionId, value]) => {
        const transaction = appState.transactions.transactions[transactionId];
        if (transaction === undefined) return diffInfo;
        switch (transaction.type) {
            case TransactionType.IN:
                return diffInfo + toNumberOrZero(value);
            case TransactionType.OUT:
                return diffInfo - toNumberOrZero(value);
            default:
                return diffInfo;
        }
    }, toNumberOrZero(bookEntry.cash.start));
    return String(-1 * (aggregatedEnd - toNumberOrZero(bookEntry.cash.end)) / 100);
};

export const toNumberOrZero = (value: string) => toCurrencyInt(value) || 0;

const OVERWRITE_CREATE_STATE_CONFIRM_MESSAGE =
    'Do you really want to edit this date, while you still haven\'t submitted your current date? This action can not be undone!';
