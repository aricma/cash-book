import {IconType} from '../../models/props';
import {dispatch} from '../../applicationState';
import {ApplicationActionType} from '../../applicationState/actions';
import {SettingsViewProps} from './props';


export const toSettingsViewProps = (): SettingsViewProps => {
    return {
        title: 'Settings',
        backup: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.DOWNLOAD_FILL,
            title: 'Backup',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.APPLICATION_BACKUP,
                });
            },
        },
        reset: {
            type: 'BUTTON_PROPS_TYPE',
            icon: IconType.CLOSE_FILL,
            title: 'Reset',
            onSelect: () => {
                dispatch({
                    type: ApplicationActionType.APPLICATION_RESET,
                });
            },
        },
        loadBackup: {
            button: {
                type: 'BUTTON_PROPS_TYPE',
                icon: IconType.UPLOAD_FILL,
                title: 'Load From Backup',
                onSelect: () => {
                },
            },
            input: {
                type: 'FILE_INPUT_PROPS_TYPE',
                value: undefined,
                placeholder: '',
                onChange: (file) => {
                    dispatch({
                        type: ApplicationActionType.APPLICATION_BACKUP_LOAD,
                        file: file,
                    });
                },
            },
        },
    };
};
