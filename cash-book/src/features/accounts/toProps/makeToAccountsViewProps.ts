import { ApplicationActionType } from '../../../applicationState/actions';
import { Dispatch } from '../../../applicationState';
import { AccountsState, AccountType, Accounts } from '../state';
import { IconType, ButtonProps, LinkProps, SpanProps } from '../../../models/props';
import { AccountsViewProps, AccountsViewType, AccountProps } from '../props/accountsViewProps';
import { makeRichTextProps } from '../../../components/richText/makeRichTextProps';
import { isPrecedent } from '../../../models/utils';
import { DOCS_ACCOUNTS, DOCS_QUICK_START } from '../../../variables/externalLinks';
import { ROUTES_SETTINGS } from '../../../variables/routes';
import { accountTypePrecedenceTable } from '../misc';

interface Request {
	dispatch: Dispatch;
	showCreateModel: () => void;
}
export const makeToAccountsViewProps =
	(request: Request) =>
	(state: AccountsState): AccountsViewProps => {
		const title = 'Accounts';
		const createButton: ButtonProps = {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.PLUS_FILL,
			title: 'Create Account',
			onSelect: request.showCreateModel,
		};

		const toAccountsTableViewProps = (accounts: Accounts): Array<AccountProps> => {
			return Object.values(accounts)
				.sort((a, b) => {
					return isPrecedent(accountTypePrecedenceTable)(a.type, b.type);
				})
				.map(
					(account): AccountProps => ({
						type: (() => {
							switch (account.type) {
								case AccountType.DEFAULT:
									return '';
								case AccountType.DIFFERENCE:
									return 'Difference';
								case AccountType.CASH_STATION:
									return 'Cashier';
							}
						})(),
						title: account.name,
						number: account.number,
						edit: {
							type: 'BUTTON_PROPS_TYPE',
							icon: IconType.PENCIL_ALT_FILL,
							title: 'Edit',
							onSelect: () => {
								request.dispatch({
									type: ApplicationActionType.ACCOUNTS_EDIT,
									accountId: account.id,
								});
								request.showCreateModel();
							},
						},
					})
				);
		};

		const hasData = Object.keys(state.accounts).length > 0;
		switch (true) {
			case hasData:
				return {
					type: AccountsViewType.DATA,
					title: title,
					create: createButton,
					accounts: toAccountsTableViewProps(state.accounts),
				};
			default:
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
								icon: IconType.BOOK_OPEN_FILL,
								link: DOCS_ACCOUNTS,
							}),
							DOCS_QUICK_START: () => ({
								type: 'LINK_PROPS_TYPE',
								title: 'Quickstart Guide',
								icon: IconType.BOOK_OPEN_FILL,
								link: DOCS_QUICK_START,
							}),
							SETTINGS: () => ({
								type: 'BUTTON_PROPS_TYPE',
								icon: IconType.COG_FILL,
								title: 'Settings',
								onSelect: () => {
									request.dispatch({
										type: ApplicationActionType.ROUTER_GO_TO,
										path: ROUTES_SETTINGS,
									});
								},
							}),
							CREATE: () => createButton,
						})([INFOBOX_MESSAGE, BACKUP_MESSAGE].join(' ')),
					},
				};
		}
	};

const INFOBOX_TITLE = 'Create your first account';
const INFOBOX_MESSAGE =
	"You have currently no accounts. Create you first account right here $CREATE. If you don't know how to get started then visit our $DOCS_QUICK_START or read about $DOCS_ACCOUNTS in our documentation.";
const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
