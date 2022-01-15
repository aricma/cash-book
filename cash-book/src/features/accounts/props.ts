import {
	ButtonProps,
	HeaderCellProps,
	BodyCellProps,
	TextInputProps,
	OptionsInputProps,
	DisabledButtonProps,
} from '../../models/props';

export interface AccountsViewProps {
	title: string;
	create: ButtonProps;
	export: ButtonProps;
	accounts: Array<Array<HeaderCellProps | BodyCellProps>>;
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
