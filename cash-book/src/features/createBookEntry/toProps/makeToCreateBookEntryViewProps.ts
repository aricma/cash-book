import { ApplicationActionType } from '../../../applicationState/actions';
import { CreateBookEntryViewProps, CreateBookEntryViewType } from '../props';
import { ApplicationState, Dispatch } from '../../../applicationState';
import { toTemplateConfigProps } from './toTemplateConfigProps';
import { makeRichTextProps, VariablesMap } from '../../../components/richText/makeRichTextProps';
import { SpanProps, ButtonProps, LinkProps, IconType, OptionsInputProps } from '../../../models/props';
import { ROUTES_SETTINGS, ROUTES_TRANSACTIONS } from '../../../variables/routes';
import { DOCS_QUICK_START, DOCS_CREATE_BOOK_ENTRY } from '../../../variables/externalLinks';

interface ToCreateBookEntryViewPropsRequest {
	dispatch: Dispatch;
	appState: ApplicationState;
	showValidation: boolean;
	setShowValidation: () => void;
	openDateOverrideConfirmationModal: () => void;
}
export const makeToCreateBookEntryViewProps = (
	request: ToCreateBookEntryViewPropsRequest
): CreateBookEntryViewProps => {
	const selectTemplate: OptionsInputProps = {
		type: 'OPTIONS_INPUT_PROPS_TYPE',
		value: request.appState.transactions.templates[request.appState.bookEntries.selectedTemplateId || '']?.name || '',
		placeholder: 'Set Template',
		options: Object.values(request.appState.transactions.templates).map((template) => ({
			type: 'BUTTON_PROPS_TYPE',
			title: template.name,
			onSelect: () => {
				request.dispatch({
					type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
					templateId: template.id,
				});
			},
		})),
	};
	const richTextVariablesMap: VariablesMap<SpanProps | ButtonProps | LinkProps | OptionsInputProps> = {
		default: (value) => ({
			type: 'SPAN_PROPS_TYPE',
			title: value,
		}),
		SELECT_TEMPLATE: () => ({
			...selectTemplate,
			value: '',
			validation: undefined,
			placeholder: 'Select A Template',
		}),
		GO_TO_TRANSACTIONS: () => ({
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CLIPBOARD_CHECK_FILL,
			title: 'Transactions',
			onSelect: () => {
				request.dispatch({
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
				request.dispatch({
					type: ApplicationActionType.ROUTER_GO_TO,
					path: ROUTES_SETTINGS,
				});
			},
		}),
	};
	const hasTemplates = Object.keys(request.appState.transactions.templates).length > 0;
	const hasNoSelectedTemplate = request.appState.bookEntries.selectedTemplateId === undefined;
	switch (true) {
		case hasTemplates && hasNoSelectedTemplate:
			return {
				type: CreateBookEntryViewType.FORM_NO_TEMPLATE,
				title: 'New Book Entry',
				template: {
					type: 'OPTIONS_INPUT_PROPS_TYPE',
					value:
						request.appState.transactions.templates[request.appState.bookEntries.selectedTemplateId || '']?.name || '',
					placeholder: 'Set Template',
					options: Object.values(request.appState.transactions.templates).map((template) => ({
						type: 'BUTTON_PROPS_TYPE',
						title: template.name,
						onSelect: () => {
							request.dispatch({
								type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
								templateId: template.id,
							});
						},
					})),
				},
				infoBox: {
					title: NO_TEMPLATE_INFO_BOX_TITLE,
					message: makeRichTextProps(richTextVariablesMap)(NO_TEMPLATES_INFO_BOX_MESSAGE + ' ' + BACKUP_MESSAGE),
				},
			};
		case hasTemplates:
			return {
				type: CreateBookEntryViewType.FORM_DEFAULT,
				title: 'New Book Entry',
				template: {
					type: 'OPTIONS_INPUT_PROPS_TYPE',
					value:
						request.appState.transactions.templates[request.appState.bookEntries.selectedTemplateId || '']?.name || '',
					placeholder: 'Set transaction template',
					options: Object.values(request.appState.transactions.templates).map((template) => ({
						type: 'BUTTON_PROPS_TYPE',
						title: template.name,
						onSelect: () => {
							request.dispatch({
								type: ApplicationActionType.BOOK_ENTRIES_CREATE_SET_TEMPLATE,
								templateId: template.id,
							});
						},
					})),
				},
				templateConfig: toTemplateConfigProps(request),
			};
		default:
			return {
				type: CreateBookEntryViewType.NO_TEMPLATES,
				title: 'New Book Entry',
				warningBox: {
					title: NO_TEMPLATES_WARNING_BOX_TITLE,
					message: makeRichTextProps(richTextVariablesMap)(NO_TEMPLATES_WARNING_BOX_MESSAGE + ' ' + BACKUP_MESSAGE),
				},
			};
	}
};

const NO_TEMPLATES_WARNING_BOX_TITLE = 'No Templates';
const NO_TEMPLATES_WARNING_BOX_MESSAGE =
	'You have no templates. You need at least one template to create a book entry. Go back to the $GO_TO_TRANSACTIONS page and create a template with transactions. If you need help please checkout our $DOCS_QUICK_START.';

const NO_TEMPLATE_INFO_BOX_TITLE = 'No Selected Template';
const NO_TEMPLATES_INFO_BOX_MESSAGE =
	'You have no template selected. You need to select a template to create a book entry for a cash station. If you need help please checkout our $DOCS_CREATE_BOOK_ENTRY.';

const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
