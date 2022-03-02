import { ApplicationState } from '../../../applicationState';
import { EntriesBookEntriesViewProps, BookEntriesViewType, BookEntryMonthViewProps } from '../props';
import { ButtonProps, IconType, OptionsInputProps } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { ROUTES_CREATE_BOOK_ENTRY } from '../../../variables/routes';
import { compact, pad } from '../../../models/utils';
import { TransactionWithValue, accountWithValue } from '../misc';
import { DateWithoutTime } from '../../../models/dateWithoutTime';
import { toBookEntryDayViewProps } from './toBookEntryDayViewProps';
import { toBookEntryMonthViewProps } from './toBookEntryMonthViewProps';
import { dispatch } from '../../../applicationState/store';

export const toEntriesBookEntriesViewProps = (appState: ApplicationState): EntriesBookEntriesViewProps => {
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
			})
		),
	};
	if (template === undefined) {
		return {
			type: BookEntriesViewType.ENTRIES,
			title: title,
			create: createButton,
			template: templateSelect,
			accounts: [],
			entries: [],
		};
	}
	const entries = appState.bookEntries.templates[template.id] || {};
	const differenceAccount = appState.accounts.accounts[template.diffAccountId];
	const differenceTransactions = Object.values(entries)
		.reduce((transactions: Array<TransactionWithValue>, bookEntry) => {
			return [
				...transactions,
				...Object.entries(bookEntry.transactions).map(
					([transactionId, value]): TransactionWithValue => ({
						...appState.transactions.transactions[transactionId],
						value: String(value),
					})
				),
			];
		}, [])
		.filter((transaction) => transaction.accountId !== template.diffAccountId);
	return {
		type: BookEntriesViewType.ENTRIES,
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
				}, {})
		),
	};
};

const toYearAndMonth = (value: string) => {
	const date = DateWithoutTime.fromString(value);
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1, 2);
	return year + '-' + month;
};
