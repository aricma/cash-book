import {NoTemplatesBookEntriesViewProps, BookEntriesViewType} from '../props';


export const toNoTemplatesBookEntriesViewProps = (): NoTemplatesBookEntriesViewProps => ({
    type: BookEntriesViewType.NO_TEMPLATES,
    title: 'Book Entries',
});
