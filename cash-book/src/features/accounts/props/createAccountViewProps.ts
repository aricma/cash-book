import { ButtonProps, OptionsInputProps, TextInputProps, DisabledButtonProps } from '../../../models/props';

export interface CreateAccountViewProps {
	close: ButtonProps;
	title: string;
	type: OptionsInputProps;
	name: TextInputProps;
	number: TextInputProps;
	cancel: ButtonProps;
	submit: ButtonProps | DisabledButtonProps;
}
