import { ButtonProps, FileInputProps } from '../../models/props';

export interface SettingsViewProps {
	title: string;
	support: ButtonProps;
	reset: ButtonProps;
	backup: ButtonProps;
	loadBackup: {
		button: ButtonProps;
		input: FileInputProps;
	};
}
