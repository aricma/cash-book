import { NoTemplateBookEntriesViewProps, BookEntriesViewType } from '../props';

export const toNoTemplateBookEntriesViewProps = (): NoTemplateBookEntriesViewProps => ({
	type: BookEntriesViewType.NO_TEMPLATE,
	title: 'Book Entries',
});
