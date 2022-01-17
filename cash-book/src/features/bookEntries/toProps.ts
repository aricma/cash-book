import { ApplicationState, dispatch } from '../../applicationState';
import { IconType, ButtonProps } from '../../models/props';
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
import { pad, compact} from '../../models/utils';
import { TransactionType, Transaction } from '../transactions/state';
import {toCurrencyInt} from '../../models/currencyInt';

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
	template: {
		type: 'OPTIONS_INPUT_PROPS_TYPE',
		value: appState.transactions.templates[appState.bookEntries.selectedTemplateId || '']?.name || '',
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
			})
		),
	},
	accounts: Object.values(
		Object.values(appState.bookEntries.entries).reduce(
			(accounts: { [accountId: string]: { title: string; number: string; value: number } }, bookEntry) => {
				const template = appState.transactions.templates[bookEntry.templateId];
				if (template === undefined) return accounts;
				const transactionWithValue = Object.entries(bookEntry.transactions).reduce(
					(diffTransaction: (Transaction & { value: number }) | undefined, [transactionId, value]) => {
						const transaction = appState.transactions.transactions[transactionId];
						if (transaction.accountId === template.diffAccountId)
							return {
								...transaction,
								value: transaction.type === TransactionType.SYS_OUT ? value : value * -1,
							};
						return undefined;
					},
					undefined
				);
				if (transactionWithValue === undefined) return accounts;
				const account = accounts[template.diffAccountId];
				const diffAccount = appState.accounts.accounts[template.diffAccountId];
				if (diffAccount === undefined) return accounts;
				if (account === undefined)
					return {
						...accounts,
						[template.diffAccountId]: {
							title: diffAccount.name,
							number: diffAccount.number,
							value: transactionWithValue.value,
						},
					};
				const accountValue = toCurrencyInt('' + account.value);
				if (accountValue === undefined) return accounts;
				const transactionValue = toCurrencyInt('' + transactionWithValue.value);
				if (transactionValue === undefined) return accounts;
				const value = toCurrencyInt('' + (accountValue + transactionValue));
				if (value === undefined) return accounts;
				return {
					...accounts,
					[template.diffAccountId]: {
						title: account.title,
						number: account.number,
						value: value / 100,
					},
				};
			},
			{}
		)
	),
	entries: Object.values(
		Object.values(appState.bookEntries.entries)
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
			const fromAccount = appState.accounts.accounts[template.cashierAccountId];
			if (fromAccount === undefined)
				return {
					type: 'ERROR_BOOKING_VIEW_PROPS',
					message: 'No account for id: ' + template.cashierAccountId,
				};
			const toAccount = appState.accounts.accounts[transaction.accountId];
			if (toAccount === undefined)
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
				from: fromAccount.name,
				to: toAccount.name,
				value: String(value),
			};
		}
	);
};
