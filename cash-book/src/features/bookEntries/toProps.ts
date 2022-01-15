import { ApplicationState, dispatch } from '../../applicationState';
import { IconType } from '../../models/props';
import { ApplicationActionType } from '../../applicationState/actions';
import { BookEntry } from './state';
import {
	BookEntriesViewProps,
	BookEntryDayViewProps,
	DataBookEntryViewProps,
	ErrorBookEnrtyViewProps,
	BookEntryMonthViewProps,
} from './props';
import { ROUTES_CREATE_BOOK_ENTRY } from '../../variables/routes';
import { DateWithoutTime } from '../../models/domain/date';
import { pad } from '../../models/utils';

export const toBookingsViewProps = (appState: ApplicationState): BookEntriesViewProps => ({
	title: 'Book Entries',
	create: {
		type: 'BUTTON_PROPS_TYPE',
		icon: IconType.PLUS_FILL,
		title: 'Create',
		onSelect: () => {
			dispatch({
				type: ApplicationActionType.ROUTER_GO_TO,
				path: ROUTES_CREATE_BOOK_ENTRY,
			});
		},
	},
	entries: Object.values(
		Object.values(appState.bookEntries.entries)
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
			}, {})
	),
});

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
		entries: toBookEntryViewProps(appState, bookEntry.date, bookEntry.transactions),
	};
};

const toBookEntryViewProps = (
	appState: ApplicationState,
	date: string,
	transactions: { [transactionId: string]: number }
) => {
	return Object.entries(transactions).map(
		([transactionId, value]): DataBookEntryViewProps | ErrorBookEnrtyViewProps => {
			const transaction = appState.transactions.transactions[transactionId];
			if (transaction === undefined)
				return {
					type: 'ERROR_BOOKING_VIEW_PROPS',
					message: 'No transaction or id: ' + transactionId,
				};
			const fromAccount = appState.accounts.accounts[transaction.fromAccountId];
			if (fromAccount === undefined)
				return {
					type: 'ERROR_BOOKING_VIEW_PROPS',
					message: 'No account for id: ' + transaction.fromAccountId,
				};
			const toAccount = appState.accounts.accounts[transaction.toAccountId];
			if (toAccount === undefined)
				return {
					type: 'ERROR_BOOKING_VIEW_PROPS',
					message: 'No account for id: ' + transaction.toAccountId,
				};
			return {
				type: 'DATA_BOOKING_VIEW_PROPS',
				date: DateWithoutTime.fromString(date).toLocaleDateString('de-DE', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}),
				title: transaction.name,
				from: fromAccount.name,
				to: toAccount.name,
				value: String(value),
			};
		}
	);
};
