import React from 'react';
import { OverrideDateConfirmationModalViewProps } from '../props';

export const Dialog: React.FC<OverrideDateConfirmationModalViewProps> = (props) => (
	<div className="p-4 pt-8 space-y-2">
		<h3 className="text-lg font-medium text-1">{props.title}</h3>
		<p className="text-2 text-sm">{props.message}</p>
		<div className="flex items-center justify-end space-x-2">
			<button type="button" onClick={props.cancel.onSelect} className="button button-xs">
				{props.cancel.title}
			</button>
			<button type="button" onClick={props.submit.onSelect} className="button-prime button-xs">
				{props.submit.title}
			</button>
		</div>
	</div>
);
