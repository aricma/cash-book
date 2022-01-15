import {
	ButtonProps,
	TextInputProps,
	OptionsInputProps,
	IconType,
	DisabledButtonProps,
} from '../../models/props';

export interface TransactionsViewProps {
	title: string;
	create: ButtonProps;
	templates: Array<TemplateViewProps>
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
}

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
