import {
	TextInputProps,
	ButtonProps,
	DisabledButtonProps,
	DatePickerInputProps,
	OptionsInputProps,
	BooleanInputProps,
	IconType,
	SpanProps,
	LinkProps,
} from '../../models/props';

export enum CreateBookEntryViewType {
	NO_TEMPLATES = 'CREATE_BOOK_ENTRY_VIEW_TYPE/NO_TEMPLATES',
	FORM_NO_TEMPLATE = 'CREATE_BOOK_ENTRY_VIEW_TYPE/FORM/NO_TEMPLATE',
	FORM_DEFAULT = 'CREATE_BOOK_ENTRY_VIEW_TYPE/FORM',
}

export type CreateBookEntryViewProps =
	| NoTemplatesCreateBookEntryViewProps
	| FormNoTemplateCreateBookEntryViewProps
	| FormDefaultCreateBookEntryViewProps;

export interface NoTemplatesCreateBookEntryViewProps {
	type: CreateBookEntryViewType.NO_TEMPLATES;
	title: string;
	warningBox: {
		title: string;
		message: Array<SpanProps | ButtonProps | LinkProps | OptionsInputProps>;
	};
}

export interface FormNoTemplateCreateBookEntryViewProps {
	type: CreateBookEntryViewType.FORM_NO_TEMPLATE;
	title: string;
	template: OptionsInputProps;
	infoBox: {
		title: string;
		message: Array<SpanProps | ButtonProps | LinkProps | OptionsInputProps>;
	};
}

export interface FormDefaultCreateBookEntryViewProps {
	type: CreateBookEntryViewType.FORM_DEFAULT;
	title: string;
	template: OptionsInputProps;
	templateConfig: CreateBookEntryTemplateConfigProps;
}

export interface CreateBookEntryTemplateConfigProps {
	date: {
		input: DatePickerInputProps;
		yesterday: ButtonProps;
		today: ButtonProps;
	};
	cashStart: TextInputProps;
	transactions: Array<TextInputProps>;
	cashEnd: TextInputProps;
	diffTransaction?: ToggleDiffViewProps;
	cancel: ButtonProps;
	submit: DisabledButtonProps | ButtonProps;
}

export enum ToggleDiffViewType {
	DEFAULT = "TOGGLE_DIFF_VIEW_TYPE/DEFAULT",
	WARNING = "TOGGLE_DIFF_VIEW_TYPE/WARNING",
	DANGER = "TOGGLE_DIFF_VIEW_TYPE/DANGER",
}

export interface ToggleDiffViewProps {
	type: ToggleDiffViewType;
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
