import {ButtonProps, TextInputProps, OptionsInputProps, DisabledButtonProps} from '../../../models/props';


export interface CreateTemplateViewProps {
    close: ButtonProps;
    title: string;
    name: TextInputProps;
    cashierAccount: OptionsInputProps;
    diffAccount: OptionsInputProps;
    transactions?: Array<CreateTransactionViewProps>;
    addTransaction?: ButtonProps;
    cancel: ButtonProps;
    submit: ButtonProps | DisabledButtonProps;
}

export interface CreateTransactionViewProps {
    order: string;
    name: TextInputProps;
    cashierAccount: string;
    type: ButtonProps;
    account: OptionsInputProps;
    remove: ButtonProps;
    decreaseOrder: ButtonProps;
    increaseOrder: ButtonProps;
}
