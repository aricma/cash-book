import React from 'react';
import { ToggleDiffViewProps } from '../props';
import { Icon } from '../../../components/icons';

export const DifferenceAccount: React.FC<ToggleDiffViewProps> = (props) => (
	<div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl flex items-center justify-between space-x-4 text-blue-600 text-blue-400">
		<input type="checkbox" checked={props.input.value} onChange={props.input.onChange} className="shrink-0" />
		<div className="space-y-4">
			<p className="text-blue-900 dark:text-blue-200 text-lg font-medium">{props.title}</p>
			<div className="space-y-2">
				<p>{props.description}</p>
				<div className="flex items-center justify-between space-x-2">
					<span className="bg-blue-200 dark:bg-blue-800 p-1 px-2 rounded-md">{props.cashierAccount}</span>
					<Icon type={props.direction} className="w-5 h-5" />
					<span className="bg-blue-200 dark:bg-blue-800 p-1 px-2 rounded-md">{props.diffAccount}</span>
					<span className="font-medium">{props.value}</span>
				</div>
				{props.input.validation && <p className="text-danger text-sm">{props.input.validation}</p>}
			</div>
		</div>
	</div>
);
