import React from 'react';
import { ButtonProps } from '../../../models/props';
import { Icon } from '../../../components/icons';

export const MenuButton: React.FC<ButtonProps> = (props) => {
	if (props.isSelected) {
		return (
			<button type="button" onClick={props.onSelect} className="rounded-md text-blue-600 hover:focus:text-blue-700">
				<div className="flex flex-col items-center justify-center space-y-1">
					{props.icon && <Icon type={props.icon} className="w-6 h-6" />}
					<span className="text-xs">{props.title}</span>
				</div>
			</button>
		);
	} else {
		return (
			<button
				type="button"
				onClick={props.onSelect}
				className="text-2 rounded-md hover:text-blue-600 focus:text-blue-600 hover:focus:text-blue-700"
			>
				<div className="flex flex-col items-center justify-center space-y-1">
					{props.icon && <Icon type={props.icon} className="w-6 h-6" />}
					<span className="text-xs">{props.title}</span>
				</div>
			</button>
		);
	}
};
