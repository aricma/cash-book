import {ButtonProps, DisabledButtonProps, LinkProps} from '../../../models/props';


export enum AccountsViewType {
    SKELETON = 'ACCOUNTS_VIEWS_TYPE/SKELETON',
    DATA = 'ACCOUNTS_VIEWS_TYPE/DATA',
}

export type AccountsViewProps = SkeletonAccountsViewProps | DataAccountsViewProps;

export interface SkeletonAccountsViewProps {
    type: AccountsViewType.SKELETON;
    title: string;
    infoBox: {
        title: string;
        message: Array<SpanProps | ButtonProps | DisabledButtonProps | LinkProps>;
    };
    create: ButtonProps;
}

export interface SpanProps {
    type: "SPAN_PROPS_TYPE",
    title: string;
}

export interface DataAccountsViewProps {
    type: AccountsViewType.DATA;
    title: string;
    create: ButtonProps;
    accounts: Array<AccountProps>;
}

export interface AccountProps {
    title: string;
    type: string;
    number: string;
    edit: ButtonProps;
}
