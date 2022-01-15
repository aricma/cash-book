import {ButtonProps, FileInputProps, DisabledButtonProps, HeaderCellProps, BodyCellProps} from '../../models/props';


export interface ImportAccountsViewProps {
    file: {
        button: ButtonProps | DisabledButtonProps;
        input: FileInputProps;
    };
    modal: ImportAccountsModalViewProps;
}

export interface ImportAccountsModalViewProps {
    title: string;
    isVisible: boolean;
    close: ButtonProps;
    accounts: Array<Array<HeaderCellProps | BodyCellProps>>;
    cancel: ButtonProps;
    submit: ButtonProps | DisabledButtonProps;
}
