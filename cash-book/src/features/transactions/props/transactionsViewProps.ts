import {ButtonProps, IconType, DisabledButtonProps, LinkProps, SpanProps} from '../../../models/props';

export enum TransactionsViewType {
	SKELETON = "TRANSACTIONS_VIEW_TYPE/SKELETON",
	MISSING_ACCOUNTS = "TRANSACTIONS_VIEW_TYPE/MISSING_ACCOUNTS",
	DATA = "TRANSACTIONS_VIEW_TYPE/DATA",
}

export type TransactionsViewProps =
	| SkeletonTransactionsViewProps
	| MissingAccountsTransactionsViewProps
	| DataTransactionsViewProps;

export interface SkeletonTransactionsViewProps {
	type: TransactionsViewType.SKELETON;
	title: string;
	create: ButtonProps;
	infoBox: {
		title: string;
		message: Array<ButtonProps | LinkProps | SpanProps>;
	}
}

export interface MissingAccountsTransactionsViewProps {
	type: TransactionsViewType.MISSING_ACCOUNTS;
	title: string;
	warningBox: {
		title: string;
		message: Array<ButtonProps | LinkProps | SpanProps>;
	}
}

export interface DataTransactionsViewProps {
	type: TransactionsViewType.DATA;
	title: string;
	create: ButtonProps;
	templates: Array<TemplateViewProps>;
}

export interface TemplateViewProps {
	title: string;
	edit: ButtonProps;
	transactions: Array<TransactionViewProps>;
}

export interface TransactionViewProps {
	order: string;
	title: string;
	cashStation: {
		title: string;
	};
	direction: IconType;
	otherAccount: {
		title: string;
	};
	decreaseOrder: ButtonProps;
	increaseOrder: ButtonProps;
	move: (fromIndex: number, toIndex: number) => void;
}
