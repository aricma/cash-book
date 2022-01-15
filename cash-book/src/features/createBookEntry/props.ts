import {
	TextInputProps,
	ButtonProps,
	DisabledButtonProps,
	DatePickerInputProps, OptionsInputProps,
} from '../../models/props';

export interface CreateBookEntryViewProps {
	title: string;
	template: OptionsInputProps;
	templateConfig?: CreateBookEntryTemplateConfigProps
}

export interface CreateBookEntryTemplateConfigProps {
	date: {
		input: DatePickerInputProps;
		yesterday: ButtonProps;
		today: ButtonProps;
	};
	transactions: Array<TextInputProps>;
	addTransaction: ButtonProps;
	valueValidation?: string;
	cancel: ButtonProps;
	submit: DisabledButtonProps | ButtonProps;
}

export interface OverrideDateConfirmationModalViewProps {
	title: string;
	message: string;
	cancel: ButtonProps;
	submit: ButtonProps;
}
