import {
    ButtonProps,
    TextInputProps,
    OptionsInputProps,
    IconType, DisabledButtonProps,
} from '../../models/props';


export interface TransactionsViewProps {
    title: string;
    create: ButtonProps;
    transactions: {
        headline: Array<string>;
        transactions: Array<TransactionViewProps>;
    };
}

export interface TransactionViewProps {
    order: string;
    title: string;
    cashStation: {
        title: string;
    };
    direction: IconType,
    otherAccount: {
        title: string;
    };
    decreaseOrder: ButtonProps;
    increaseOrder: ButtonProps;
}

export interface CreateTransactionViewProps {
    close: ButtonProps;
    title: string;
    name: TextInputProps;
    cashStation: {
        value: string;
        validation?: string;
    };
    type: ButtonProps;
    otherAccount: OptionsInputProps;
    cancel: ButtonProps;
    submit: ButtonProps | DisabledButtonProps;
}
