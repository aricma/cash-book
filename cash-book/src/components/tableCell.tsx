import React from 'react';
import { HeaderCellProps, BodyCellProps, ButtonProps, DisabledButtonProps } from '../models/props';
import { Icon } from './icons';

export const TableCell: React.FC<HeaderCellProps | BodyCellProps | ButtonProps | DisabledButtonProps> = (props) => {
	switch (props.type) {
		case 'HEADER_CELL_PROPS_TYPE':
			return <span className="place-self-center text-blue-600 uppercase font-bold">{props.value}</span>;
		case 'BODY_CELL_PROPS_TYPE':
			return <span className="text-2">{props.value}</span>;
		case 'BUTTON_PROPS_TYPE':
			return (
				<button type="button" onClick={props.onSelect} className="button-prime button-xs">
					{props.icon ? (
						<>
							<Icon type={props.icon} className="w-5 h-5" />
							<span className="sr-only">{props.title}</span>
						</>
					) : (
						<span className="">{props.title}</span>
					)}
				</button>
			);
		case 'DISABLED_BUTTON_PROPS_TYPE':
			return (
				<button type="button" disabled className="button-disabled button-xs">
					{props.icon ? (
						<>
							<Icon type={props.icon} className="w-5 h-5" />
							<span className="sr-only">{props.title}</span>
						</>
					) : (
						<span className="">{props.title}</span>
					)}
				</button>
			);
		default:
			return null;
	}
};
