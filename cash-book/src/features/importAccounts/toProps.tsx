import {ImportAccountsViewProps} from './props';
import {IconType} from '../../models/props';
import {toAccountsTableViewProps} from '../accounts/toProps';
import {dispatch} from '../../applicationState';
import {ApplicationActionType} from '../../applicationState/actions';
import {Account} from '../accounts/state';

export interface RequestImportAccountsViewProps {
    modal: {
        isVisible: boolean;
        close: () => void;
    },
    accounts: { [accountId: string]: Account },
    file: {
        isLoading: boolean;
        value?: File;
        set: (file: File) => void;
        close: () => void;
    },
}
export const toImportAccountsViewProps = (req: RequestImportAccountsViewProps): ImportAccountsViewProps => {
    return {
        modal: {
            isVisible: req.modal.isVisible,
            title: 'Import Accounts',
            close: {
                type: 'BUTTON_PROPS_TYPE',
                icon: IconType.CLOSE_FILL,
                title: 'Close',
                onSelect: () => {
                    req.file.close();
                },
            },
            accounts: toAccountsTableViewProps(req.accounts),
            cancel: {
                type: 'BUTTON_PROPS_TYPE',
                title: 'Cancel',
                onSelect: () => {
                    req.file.close();
                },
            },
            submit: {
                type: 'BUTTON_PROPS_TYPE',
                title: 'Submit',
                onSelect: () => {
                    dispatch({
                        type: ApplicationActionType.ACCOUNTS_IMPORT,
                        accounts: req.accounts,
                    });
                    req.file.close();
                },
            },
        },
        file: {
            button: req.file.isLoading ? {
                type: 'DISABLED_BUTTON_PROPS_TYPE',
                icon: IconType.SPINNER,
                title: 'Import Accounts',
            } : {
                type: 'BUTTON_PROPS_TYPE',
                icon: IconType.UPLOAD_FILL,
                title: 'Import Accounts',
                onSelect: () => {
                }, // use handler form FileInput
            },
            input: {
                type: 'FILE_INPUT_PROPS_TYPE',
                value: req.file.value,
                placeholder: 'Set file',
                onChange: req.file.set,
            },
        },
    };
};
