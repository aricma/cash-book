import {ApplicationState, dispatch} from '../../../applicationState';
import {SkeletonBookEntriesViewProps, BookEntriesViewType} from '../props';
import {ButtonProps, IconType, OptionsInputProps, SpanProps, LinkProps} from '../../../models/props';
import {ApplicationActionType} from '../../../applicationState/actions';
import {ROUTES_CREATE_BOOK_ENTRY, ROUTES_SETTINGS} from '../../../variables/routes';
import {compact} from '../../../models/utils';
import {makeRichTextProps} from '../../../components/richText/makeRichTextProps';
import {DOCS_ACCOUNTS, DOCS_QUICK_START, DOCS_CREATE_BOOK_ENTRY} from '../../../variables/externalLinks';


export const toSkeletonBookEntriesViewProps = (appState: ApplicationState): SkeletonBookEntriesViewProps => {
    const createButton: ButtonProps = {
        type: 'BUTTON_PROPS_TYPE',
        icon: IconType.PLUS_FILL,
        title: 'Create',
        onSelect: () => {
            dispatch({
                type: ApplicationActionType.ROUTER_GO_TO,
                path: ROUTES_CREATE_BOOK_ENTRY,
            });
        },
    };
    const template = appState.transactions.templates[appState.bookEntries.selectedTemplateId || ''];
    const templateSelect: OptionsInputProps = {
        type: 'OPTIONS_INPUT_PROPS_TYPE',
        value: template?.name || '',
        placeholder: 'set template',
        options: compact(
            Object.keys(appState.transactions.templates).map((templateId): ButtonProps | undefined => {
                const template = appState.transactions.templates[templateId];
                if (template === undefined) return undefined;
                return {
                    type: 'BUTTON_PROPS_TYPE',
                    title: template.name,
                    onSelect: () => {
                        dispatch({
                            type: ApplicationActionType.BOOK_ENTRIES_SET_TEMPLATE,
                            templateId: templateId,
                        });
                    },
                };
            }),
        ),
    };
    return ({
        type: BookEntriesViewType.SKELETON,
        title: 'Book Entries',
        create: createButton,
        template: templateSelect,
        infoBox: {
            title: INFOBOX_TITLE,
            message: makeRichTextProps<SpanProps | ButtonProps | LinkProps>({
                default: (value) => ({
                    type: 'SPAN_PROPS_TYPE',
                    title: value,
                }),
                DOCS_CREATE_BOOK_ENTRY: () => ({
                    type: 'LINK_PROPS_TYPE',
                    title: 'Create A Book Entry Guide',
                    icon: IconType.BOOK_OPEN_FILL,
                    link: DOCS_CREATE_BOOK_ENTRY,
                }),
                SETTINGS: () => ({
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
                CREATE: () => createButton,
            })(INFOBOX_MESSAGE + ' ' + BACKUP_MESSAGE),
        },
    });
};

const INFOBOX_TITLE = 'Create A Book Entry';
const INFOBOX_MESSAGE = 'You have currently no book entries. $CREATE a book entry for this template. If you do not know how to create a book entry then visit our $DOCS_CREATE_BOOK_ENTRY.';
const BACKUP_MESSAGE = 'If you have a backup of your data, then go to $SETTINGS and import you backup.';
