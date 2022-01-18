import {ButtonProps, FileInputProps} from '../../models/props';


export interface SettingsViewProps {
    title: string;
    reset: ButtonProps;
    backup: ButtonProps;
    loadBackup: {
        button: ButtonProps;
        input: FileInputProps;
    };
}
