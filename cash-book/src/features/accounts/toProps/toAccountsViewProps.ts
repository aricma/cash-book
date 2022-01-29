import {ApplicationActionType} from '../../../applicationState/actions';
import {ApplicationState, dispatch} from '../../../applicationState';
import {IconType, ButtonProps, LinkProps, SpanProps} from '../../../models/props';
import {AccountsViewProps, AccountsViewType} from '../props/accountsViewProps';
import {toAccountsTableViewProps} from './toAccountsTableViewProps';
import {makeRichTextProps} from '../../../components/richText/makeRichTextProps';
import {DOCS_ACCOUNTS, DOCS_QUICK_START} from '../../../variables/externalLinks';
import {ROUTES_SETTINGS} from '../../../variables/routes';


export const toAccountsViewProps = (appState: ApplicationState, showCreateModel: () => void): AccountsViewProps => {
    const hasNoData = Object.keys(appState.accounts.accounts).length === 0;

    const title = 'Accounts';
    const createButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create Account',
        onSelect: showCreateModel,
    };

    if (hasNoData) {
        return {
            type: AccountsViewType.SKELETON,
            title: title,
            create: createButton,
            infoBox: {
                title: INFOBOX_TITLE,
                message: makeRichTextProps<SpanProps | ButtonProps | LinkProps>({
                    default: (value) => ({
                        type: 'SPAN_PROPS_TYPE',
                        title: value,
                    }),
                    DOCS_ACCOUNTS: () => ({
                        type: 'LINK_PROPS_TYPE',
                        title: 'Accounts',
                        link: DOCS_ACCOUNTS,
                    }),
                    DOCS_QUICK_START: () => ({
                        type: "LINK_PROPS_TYPE",
                        title: "Quickstart Guide",
                        link: DOCS_QUICK_START,
                    }),
                    SETTINGS: () => ({
                        type: 'BUTTON_PROPS_TYPE',
                        icon: IconType.COG_FILL,
                        title: 'Settings',
                        onSelect: () => {
                            dispatch({
                                type: ApplicationActionType.ROUTER_GO_TO,
                                path: ROUTES_SETTINGS,
                            })
                        },
                    }),
                    CREATE: () => createButton,
                })([INFOBOX_MESSAGE, BACKUP_MESSAGE].join(' '))
            },
        };
    } else {
        return {
            type: AccountsViewType.DATA,
            title: title,
            create: createButton,
            accounts: toAccountsTableViewProps(appState.accounts.accounts, showCreateModel),
        };
    }
}

const INFOBOX_TITLE = "Create your first account";
const INFOBOX_MESSAGE = "You have currently no accounts. Create you first account right here $CREATE. If you don't know how to get started then visit our $DOCS_QUICK_START or read about $DOCS_ACCOUNTS in our documentation.";
const BACKUP_MESSAGE = "If you have a backup of your data, then go to $SETTINGS and import you backup.";
