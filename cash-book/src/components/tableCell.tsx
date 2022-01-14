import React from 'react';
import { HeaderCellProps, BodyCellProps, ButtonProps } from '../models/props';

export const TableCell: React.FC<
	HeaderCellProps | BodyCellProps | ButtonProps
> = (props) => {
	switch (props.type) {
		case 'HEADER_CELL_PROPS_TYPE':
			return <span className="text-1 uppercase">{props.value}</span>;
		case 'BODY_CELL_PROPS_TYPE':
			return <span className="text-2">{props.value}</span>;
		// case 'BUTTON_PROPS_TYPE':
		//     return (<button>{}</button>)
		default:
			return null;
	}
};
