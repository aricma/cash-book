import {
	TextInputProps,
	ButtonProps,
	DisabledButtonProps,
	DatePickerInputProps,
	OptionsInputProps, BooleanInputProps, IconType,
} from '../../models/props';

export interface CreateBookEntryViewProps {
	title: string;
	template: OptionsInputProps;
	templateConfig?: CreateBookEntryTemplateConfigProps;
}

export interface CreateBookEntryTemplateConfigProps {
	date: {
		input: DatePickerInputProps;
		yesterday: ButtonProps;
		today: ButtonProps;
	};
	transactions: Array<TextInputProps>;
	addTransaction: ButtonProps;
	diffTransaction?: ToggleDiffViewProps;
	cancel: ButtonProps;
	submit: DisabledButtonProps | ButtonProps;
}

export interface ToggleDiffViewProps {
	input: BooleanInputProps;
	title: string;
	cashierAccount: string;
	direction: IconType;
	diffAccount: string;
	value: string;
	description: string;
}

export interface OverrideDateConfirmationModalViewProps {
	title: string;
	message: string;
	cancel: ButtonProps;
	submit: ButtonProps;
}
