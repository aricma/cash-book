import React from 'react';
import { BookEntriesViewProps, BookEntriesViewType } from '../props';
import { EntriesBookEntriesView } from './entriesBookEntriesView';
import { EmptyBookEntriesView } from './emptyBookEntriesView';
import { SkeletonBookEntriesView } from './skeletonBookEntriesView';

export const BookEntriesView: React.FC<BookEntriesViewProps> = (props) => {
	switch (props.type) {
		case BookEntriesViewType.NO_TEMPLATE:
		case BookEntriesViewType.NO_TEMPLATES:
			return <EmptyBookEntriesView {...props} />;
		case BookEntriesViewType.SKELETON:
			return <SkeletonBookEntriesView {...props} />;
		case BookEntriesViewType.ENTRIES:
			return <EntriesBookEntriesView {...props} />;
		default:
			return null;
	}
};
