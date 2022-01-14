import { ButtonProps } from '../../models/props';

export interface BookEntriesViewProps {
	title: string;
	create: ButtonProps;
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
	entries: Array<DataBookEntryViewProps | ErrorBookEnrtyViewProps>;
}

export interface DataBookEntryViewProps {
	type: 'DATA_BOOKING_VIEW_PROPS';
	date: string;
	title: string;
	from: string;
	to: string;
	value: string;
}

export interface ErrorBookEnrtyViewProps {
	type: 'ERROR_BOOKING_VIEW_PROPS';
	message: string;
}
