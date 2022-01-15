export enum IconType {
	DEFAULT = 'ICON_TYPE/DEFAULT',
	CASHIER = 'ICON_TYPE/CASHIER',
	PLUS_FILL = 'ICON_TYPE/PLUS/FILL',
	COLLECTION_FILL = 'ICON_TYPE/COLLECTION/FILL',
	CLIPBOARD_CHECK_FILL = 'ICON_TYPE/CLIPBOARD_CHECK/FILL',
	CHEVRON_UP_FILL = 'ICON_TYPE/CHEVRON_UP/FILL',
	CHEVRON_RIGHT_FILL = 'ICON_TYPE/CHEVRON_RIGHT/FILL',
	CHEVRON_DOWN_FILL = 'ICON_TYPE/CHEVRON_DOWN/FILL',
	CHEVRON_LEFT_FILL = 'ICON_TYPE/CHEVRON_LEFT/FILL',
	ARROW_NARROW_RIGHT_FILL = 'ICON_TYPE/ARROW_NARROW_RIGHT/FILL',
	ARROW_NARROW_LEFT_FILL = 'ICON_TYPE/ARROW_NARROW_LEFT/FILL',
	ARROW_NARROW_RIGHT_STROKE = 'ICON_TYPE/ARROW_NARROW_RIGHT/STROKE',
	ARROW_NARROW_LEFT_STROKE = 'ICON_TYPE/ARROW_NARROW_LEFT/STROKE',
	CLOSE_FILL = 'ICON_TYPE/CLOSE/FILL',
	BOOK_OPEN_FILL = 'ICON_TYPE/BOOK_OPEN/FILL',
	BOOK_OPEN_STROKE = 'ICON_TYPE/BOOK_OPEN/STROKE',
	UPLOAD_FILL = 'ICON_TYPE/UPLOAD/FILL',
	DOWNLOAD_FILL = 'ICON_TYPE/DOWNLOAD/FILL',
	SPINNER = 'ICON_TYPE/SPINNER',
	PENCIL_ALT_FILL = 'ICON_TYPE/PENCIL_ALT/FILL',
}

export interface WithIconType {
	type: IconType;
}

export interface WithClasses {
	className: string;
}

export interface TextInputProps {
	type: 'TEXT_INPUT_PROPS_TYPE';
	label?: string;
	value: string;
	placeholder: string;
	validation?: string;
	onChange: (value: string) => void;
}

export interface BooleanInputProps {
	type: 'BOOLEAN_INPUT_PROPS_TYPE';
	title?: string;
	value: boolean;
	validation?: string;
	onChange: () => void;
}

export interface OptionsInputProps {
	type: 'OPTIONS_INPUT_PROPS_TYPE';
	value: string;
	placeholder: string;
	validation?: string;
	options: Array<ButtonProps | DisabledButtonProps>;
}

export interface FileInputProps {
	type: 'FILE_INPUT_PROPS_TYPE';
	value?: File;
	placeholder: string;
	validation?: string;
	onChange: (value: File) => void;
}

export interface ButtonProps {
	type: 'BUTTON_PROPS_TYPE';
	icon?: IconType;
	isSelected?: boolean;
	title: string;
	onSelect: () => void;
}

export interface DisabledButtonProps {
	type: 'DISABLED_BUTTON_PROPS_TYPE';
	icon?: IconType;
	title: string;
}

export interface HeaderCellProps {
	type: 'HEADER_CELL_PROPS_TYPE';
	value: string;
}

export interface BodyCellProps {
	type: 'BODY_CELL_PROPS_TYPE';
	value: string;
}

export interface DatePickerInputProps {
	type: 'DATE_PICKER_INPUT_PROPS';
	label?: string;
	value: string;
	onChange: (date: string) => void;
}
