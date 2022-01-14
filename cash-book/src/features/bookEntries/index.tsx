import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { BookEntriesView } from './views';
import { toBookingsViewProps } from './toProps';

export const Bookings: React.FC = () => {
	const appState = useAppState(selectAppState);
	const viewProps = toBookingsViewProps(appState);
	return <BookEntriesView {...viewProps} />;
};
