import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { BookEntriesView } from './views/bookEntriesView';
import { toBookEntriesViewProps } from './toProps/toBookEntriesViewProps';

export const Bookings: React.FC = () => {
	const appState = useAppState(selectAppState);
	const viewProps = toBookEntriesViewProps(appState);
	return <BookEntriesView {...viewProps} />;
};
