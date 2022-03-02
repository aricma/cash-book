import { ButtonProps } from '../../models/props';

export interface ErrorViewProps {
	title: string;
	message: string;
	buttons: Array<ButtonProps>;
}
