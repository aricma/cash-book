import { MissingAccountsTransactionsViewProps, TransactionsViewType } from '../props/transactionsViewProps';
import { SpanProps, ButtonProps, LinkProps, IconType } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { makeRichTextProps } from '../../../components/richText/makeRichTextProps';
import { DOCS_QUICK_START } from '../../../variables/externalLinks';
import { ROUTES_SETTINGS, ROUTES_ACCOUNTS } from '../../../variables/routes';
import { dispatch } from '../../../applicationState/store';

export const toMissingAccountsTransactionsViewProps = (): MissingAccountsTransactionsViewProps => {
	return {
		type: TransactionsViewType.MISSING_ACCOUNTS,
		title: 'Transactions',
		warningBox: {
			title: WARNING_BOX_TITLE,
			message: makeRichTextProps<SpanProps | ButtonProps | LinkProps>({
				default: (value): SpanProps => ({
					type: 'SPAN_PROPS_TYPE',
					title: value,
				}),
				GO_TO_ACCOUNTS: (): ButtonProps => ({
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.AT_SYMBOL_FILL,
					title: 'Accounts',
					onSelect: () => {
						dispatch({
							type: ApplicationActionType.ROUTER_GO_TO,
							path: ROUTES_ACCOUNTS,
						});
					},
				}),
				DOCS_QUICK_START: (): LinkProps => ({
					type: 'LINK_PROPS_TYPE',
					title: 'Quickstart Guide',
					icon: IconType.BOOK_OPEN_FILL,
					link: DOCS_QUICK_START,
				}),
				SETTINGS: (): ButtonProps => ({
					type: 'BUTTON_PROPS_TYPE',
					icon: IconType.COG_FILL,
					title: 'Settings',
					onSelect: () => {
						dispatch({
							type: ApplicationActionType.ROUTER_GO_TO,
							path: ROUTES_SETTINGS,
						});
					},
				}),
			})([WARNING_BOX_MESSAGE, BACKUP_MESSAGE].join(' ')),
		},
	};
};

const WARNING_BOX_TITLE = 'Missing Accounts';
const WARNING_BOX_MESSAGE =
	'You have no templates. You can create a template when you have at least one cashier account and one difference account. Go back to the $GO_TO_ACCOUNTS page and create the missing accounts. If you need help please checkout our $DOCS_QUICK_START.';
const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
