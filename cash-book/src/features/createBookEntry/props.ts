import {
	TextInputProps,
	ButtonProps,
	DisabledButtonProps,
	DatePickerInputProps,
} from '../../models/props';

export interface CreateBookEntryViewProps {
	title: string;
	date: {
		input: DatePickerInputProps;
		yesterday: ButtonProps;
		today: ButtonProps;
	};
	inputs: Array<TextInputProps>;
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
