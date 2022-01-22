import { ButtonProps, OptionsInputProps, IconType } from '../../models/props';

export enum BookEntriesViewPropsType {
	SKELETON = 'BOOK_ENTRIES_VIEW_PROPS_TYPE/SKELETON',
	SELECT_TEMPLATE = 'BOOK_ENTRIES_VIEW_PROPS_TYPE/SELECT_TEMPLATE',
	BOOK_ENTRIES = 'BOOK_ENTRIES_VIEW_PROPS_TYPE/BOOK_ENTRIES',
	ERROR = 'BOOK_ENTRIES_VIEW_PROPS_TYPE/ERROR',
}

export type BookEntriesViewProps = EntriesBookEntriesViewProps;

export interface EntriesBookEntriesViewProps {
	title: string;
	template: OptionsInputProps;
	create: ButtonProps;
	accounts: Array<{ title: string; number: string; value: number }>;
	entries: Array<BookEntryMonthViewProps>;
}

export interface BookEntryMonthViewProps {
	date: string;
	export: ButtonProps;
	entries: Array<BookEntryDayViewProps>;
}

export interface BookEntryDayViewProps {
	date: string;
	export: ButtonProps;
	edit: ButtonProps;
	cashInfo: {
		start: string;
		add: string;
		subtract: string;
		end: string;
		diff: string;
	};
	entries: Array<DataBookEntryViewProps | ErrorBookEnrtyViewProps>;
}

export interface DataBookEntryViewProps {
	type: 'DATA_BOOKING_VIEW_PROPS';
	date: string;
	title: string;
	cashierAccount: string;
	direction: IconType;
	otherAccount: string;
	value: string;
}

export interface ErrorBookEnrtyViewProps {
	type: 'ERROR_BOOKING_VIEW_PROPS';
	message: string;
}
