import { ButtonProps, OptionsInputProps, IconType, SpanProps, LinkProps } from '../../models/props';

export enum BookEntriesViewType {
	SKELETON = 'BOOK_ENTRIES_VIEW_TYPE/SKELETON',
	NO_TEMPLATE = 'BOOK_ENTRIES_VIEW_TYPE/NO_TEMPLATE',
	NO_TEMPLATES = 'BOOK_ENTRIES_VIEW_TYPE/NO_TEMPLATES',
	ENTRIES = 'BOOK_ENTRIES_VIEW_TYPE/ENTRIES',
}

export type BookEntriesViewProps =
	| SkeletonBookEntriesViewProps
	| NoTemplateBookEntriesViewProps
	| NoTemplatesBookEntriesViewProps
	| EntriesBookEntriesViewProps;

export interface SkeletonBookEntriesViewProps {
	type: BookEntriesViewType.SKELETON;
	title: string;
	template: OptionsInputProps;
	create: ButtonProps;
	infoBox: {
		title: string;
		message: Array<SpanProps | ButtonProps | LinkProps>;
	};
}

export interface NoTemplateBookEntriesViewProps {
	type: BookEntriesViewType.NO_TEMPLATE;
	title: string;
}

export interface NoTemplatesBookEntriesViewProps {
	type: BookEntriesViewType.NO_TEMPLATES;
	title: string;
}

export interface EntriesBookEntriesViewProps {
	type: BookEntriesViewType.ENTRIES;
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
