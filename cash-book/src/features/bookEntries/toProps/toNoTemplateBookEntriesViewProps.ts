import { NoTemplateBookEntriesViewProps, BookEntriesViewType } from '../props';
import {dispatch, ApplicationState} from '../../../applicationState';
import {ApplicationActionType} from '../../../applicationState/actions';
import {makeRichTextProps} from '../../../components/richText/makeRichTextProps';
import {IconType, ButtonProps, LinkProps, SpanProps} from '../../../models/props';
import {ROUTES_TRANSACTIONS, ROUTES_SETTINGS} from '../../../variables/routes';
import {DOCS_QUICK_START, DOCS_CREATE_BOOK_ENTRY} from '../../../variables/externalLinks';

export const toNoTemplateBookEntriesViewProps = (appState: ApplicationState): NoTemplateBookEntriesViewProps => ({
	type: BookEntriesViewType.NO_TEMPLATE,
	title: 'Book Entries',
	template: {
		type: 'OPTIONS_INPUT_PROPS_TYPE',
		value: appState.transactions.templates[appState.bookEntries.selectedTemplateId || '']?.name || '',
		placeholder: 'Set Template',
		options: Object.values(appState.transactions.templates).map((template) => ({
			type: 'BUTTON_PROPS_TYPE',
			title: template.name,
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
					templateId: template.id,
				});
			},
		})),
	},
	infoBox: {
		title: NO_TEMPLATE_INFO_BOX_TITLE,
		message: makeRichTextProps<SpanProps | ButtonProps | LinkProps>({
			default: (value) => ({
				type: 'SPAN_PROPS_TYPE',
				title: value,
			}),
			GO_TO_TRANSACTIONS: () => ({
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.CLIPBOARD_CHECK_FILL,
				title: 'Transactions',
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_TRANSACTIONS,
					});
				},
			}),
			DOCS_QUICK_START: () => ({
				type: 'LINK_PROPS_TYPE',
				title: 'Quickstart Guide',
				icon: IconType.BOOK_OPEN_FILL,
				link: DOCS_QUICK_START,
			}),
			DOCS_CREATE_BOOK_ENTRY: () => ({
				type: 'LINK_PROPS_TYPE',
				title: 'Create A Book Entry Guide',
				icon: IconType.BOOK_OPEN_FILL,
				link: DOCS_CREATE_BOOK_ENTRY,
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
		})(NO_TEMPLATES_INFO_BOX_MESSAGE + ' ' + BACKUP_MESSAGE),
	},
});

const NO_TEMPLATE_INFO_BOX_TITLE = 'No Selected Template';
const NO_TEMPLATES_INFO_BOX_MESSAGE =
	'You have no template selected. You need to select a template to create a book entry for a cash station. If you need help please checkout our $DOCS_CREATE_BOOK_ENTRY.';

const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
