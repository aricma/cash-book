import React from 'react';
import { ButtonProps } from '../../../models/props';
import { Icon } from '../../../components/icons';

export const Button: React.FC<ButtonProps> = (props) => {
	return (
		<button
			type="button"
			onClick={props.onSelect}
			className="button-prime button-xs p-1 bg-blue-300 dark:bg-blue-800 hover:text-white !ring-offset-blue-200 dark:!ring-offset-blue-900"
		>
			{props.icon && <Icon type={props.icon} className="w-5 h-5" />}
			<span className="sr-only">{props.title}</span>
		</button>
	);
};
