import React from 'react';
import { useMatch } from 'react-router-dom';
import { useAppState, selectAppState } from '../../applicationState';
import { MenuView } from './views/menuView';
import { toMenuViewProps } from './toProps/toMenuViewProps';
import {
	ROUTES_ACCOUNTS,
	ROUTES_CREATE_BOOK_ENTRY,
	ROUTES_TRANSACTIONS,
	ROUTES_BOOK_ENTRIES,
	ROUTES_SETTINGS,
} from '../../variables/routes';

export const Menu: React.FC = () => {
	const matchAccountsRoute = useMatch(ROUTES_ACCOUNTS);
	const matchTransactionsRoute = useMatch(ROUTES_TRANSACTIONS);
	const matchCreateBookEntryRoute = useMatch(ROUTES_CREATE_BOOK_ENTRY);
	const matchBookEntriesRoute = useMatch(ROUTES_BOOK_ENTRIES);
	const matchSettingsRoute = useMatch(ROUTES_SETTINGS);
	const match = (path: string) => {
		switch (path) {
			case ROUTES_ACCOUNTS:
				return matchAccountsRoute !== null;
			case ROUTES_TRANSACTIONS:
				return matchTransactionsRoute !== null;
			case ROUTES_CREATE_BOOK_ENTRY:
				return matchCreateBookEntryRoute !== null;
			case ROUTES_BOOK_ENTRIES:
				return matchBookEntriesRoute !== null;
			case ROUTES_SETTINGS:
				return matchSettingsRoute !== null;
			default:
				return false;
		}
	};
	const appState = useAppState(selectAppState);
	const viewProps = toMenuViewProps(match, appState);
	return <MenuView {...viewProps} />;
};
