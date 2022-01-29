import {ApplicationState, dispatch} from '../../../applicationState';
import {OverrideDateConfirmationModalViewProps} from '../props';
import {DateWithoutTime} from '../../../models/domain/date';
import {ApplicationActionType} from '../../../applicationState/actions';
import {ROUTES_BOOK_ENTRIES} from '../../../variables/routes';


export const toOverrideDateConfirmationModalViewProps = (
    appState: ApplicationState,
    closeModal: () => void,
): OverrideDateConfirmationModalViewProps | undefined => {
    const selectedTemplateId = appState.bookEntries.selectedTemplateId;
    const config = appState.bookEntries.create.templates[selectedTemplateId || ''];
    if (config === undefined) return undefined;
    const dateDisplay = DateWithoutTime.fromString(config.date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return {
        title: 'Date already exists!',
        message: `Do you really want to override this date?(${dateDisplay})`,
        cancel: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'No',
            onSelect: () => {
                closeModal();
            },
        },
        submit: {
            type: 'BUTTON_PROPS_TYPE',
            title: 'Yes',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.BOOK_ENTRIES_CREATE_SUBMIT,
                    templateId: config.templateId,
                });
                dispatch({
                    type: ApplicationActionType.ROUTER_GO_TO,
                    path: ROUTES_BOOK_ENTRIES,
                });
                closeModal();
            },
        },
    };
};
