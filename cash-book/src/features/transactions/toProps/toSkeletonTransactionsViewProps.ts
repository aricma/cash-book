import { ApplicationState, dispatch } from '../../../applicationState';
import { SkeletonTransactionsViewProps, TransactionsViewType } from '../props/transactionsViewProps';
import { IconType, SpanProps, ButtonProps, LinkProps } from '../../../models/props';
import { ApplicationActionType } from '../../../applicationState/actions';
import { DOCS_QUICK_START, DOCS_TRANSACTIONS } from '../../../variables/externalLinks';
import { ROUTES_SETTINGS } from '../../../variables/routes';
import { makeRichTextProps } from '../../../components/richText/makeRichTextProps';

export const toSkeletonTransactionsViewProps = (
	appState: ApplicationState,
	openModal: () => void
): SkeletonTransactionsViewProps => {
	const createButton: ButtonProps = {
		type: 'BUTTON_PROPS_TYPE',
		title: 'Create',
		icon: IconType.PLUS_FILL,
		onSelect: openModal,
	};
	return {
		type: TransactionsViewType.SKELETON,
		title: 'Transactions',
		create: createButton,
		infoBox: {
			title: INFOBOX_TITLE,
			message: makeRichTextProps<SpanProps | ButtonProps | LinkProps>({
				default: (value): SpanProps => ({
					type: 'SPAN_PROPS_TYPE',
					title: value,
				}),
				DOCS_TRANSACTIONS: (): LinkProps => ({
					type: 'LINK_PROPS_TYPE',
					icon: IconType.BOOK_OPEN_FILL,
					title: 'Accounts',
					link: DOCS_TRANSACTIONS,
				}),
				DOCS_QUICK_START: (): LinkProps => ({
					type: 'LINK_PROPS_TYPE',
					icon: IconType.BOOK_OPEN_FILL,
					title: 'Quickstart Guide',
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
				CREATE: (): ButtonProps => createButton,
			})([INFOBOX_MESSAGE, BACKUP_MESSAGE].join(' ')),
		},
	};
};

const INFOBOX_TITLE = 'Create your first Transaction-Template';
const INFOBOX_MESSAGE =
	'You have no templates. Create your first template right here $CREATE. If you do not know how to get started then visit our $DOCS_QUICK_START or read about $DOCS_TRANSACTIONS in our documentation.';
const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
