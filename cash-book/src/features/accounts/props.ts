import {
	ButtonProps,
	HeaderCellProps,
	BodyCellProps,
	TextInputProps,
	OptionsInputProps,
	DisabledButtonProps,
} from '../../models/props';

export interface AccountsViewProps {
	create: ButtonProps;
	title: string;
	accounts: Array<Array<HeaderCellProps | BodyCellProps | ButtonProps>>;
}

export interface CreateAccountViewProps {
	close: ButtonProps;
	title: string;
	type: OptionsInputProps;
	name: TextInputProps;
	number: TextInputProps;
	cancel: ButtonProps;
	submit: ButtonProps | DisabledButtonProps;
}
