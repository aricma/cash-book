import {ApplicationState, dispatch} from '../../../applicationState';
import {MenuViewProps} from '../props/menuViewProps';
import {ButtonProps, IconType} from '../../../models/props';
import {
    ROUTES_ACCOUNTS,
    ROUTES_TRANSACTIONS,
    ROUTES_CREATE_BOOK_ENTRY,
    ROUTES_BOOK_ENTRIES,
    ROUTES_SETTINGS, ROUTES_SUPPORT,
} from '../../../variables/routes';
import {ApplicationActionType} from '../../../applicationState/actions';


export const toMenuViewProps = (matchesRoute: (route: string) => boolean, appState: ApplicationState): MenuViewProps => {
    const hasNoAccount = Object.keys(appState.accounts.accounts).length === 0;
    const hasNoTransactions = Object.keys(appState.transactions.templates).length === 0;
    const hasNoEntries = Object.keys(appState.bookEntries.templates).length === 0;
    const accountsButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.AT_SYMBOL_FILL,
        title: 'Accounts',
        isSelected: matchesRoute(ROUTES_ACCOUNTS),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_ACCOUNTS,
            });
        },
    };
    const transactionsButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.CLIPBOARD_CHECK_FILL,
        title: 'Transactions',
        isSelected: matchesRoute(ROUTES_TRANSACTIONS),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_TRANSACTIONS,
            });
        },
    };
    const createBookEntry: ButtonProps & { isCenter?: boolean } = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create Book Entry',
        isCenter: true,
        isSelected: matchesRoute(ROUTES_CREATE_BOOK_ENTRY),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_CREATE_BOOK_ENTRY,
            });
        },
    };
    const entriesButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.CHART_BAR_FILL,
        title: 'Entries',
        isSelected: matchesRoute(ROUTES_BOOK_ENTRIES),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_BOOK_ENTRIES,
            });
        },
    };
    const settingsButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.COG_FILL,
        title: 'Settings',
        isSelected: matchesRoute(ROUTES_SETTINGS),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_SETTINGS,
            });
        },
    };
    const supportButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.SUPPORT_FILL,
        title: 'Support',
        isSelected: matchesRoute(ROUTES_SUPPORT),
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_SUPPORT,
            });
        },
    };

    switch (true) {
        case hasNoAccount:
            return {
                pages: [
                    accountsButton,
                    settingsButton,
                    supportButton,
                ],
            };
        case hasNoTransactions:
            return {
                pages: [
                    accountsButton,
                    transactionsButton,
                    settingsButton,
                    supportButton,
                ],
            };
        case hasNoEntries:
            return {
                pages: [
                    accountsButton,
                    transactionsButton,
                    createBookEntry,
                    settingsButton,
                    supportButton,
                ],
            };
        default:
            return {
                pages: [
                    accountsButton,
                    transactionsButton,
                    createBookEntry,
                    entriesButton,
                    settingsButton,
                ],
            };
    }
};
