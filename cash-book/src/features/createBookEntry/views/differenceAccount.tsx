import React from 'react';
import { ToggleDiffViewProps, ToggleDiffViewType } from '../props';
import { Icon } from '../../../components/icons';

export const DifferenceAccount: React.FC<ToggleDiffViewProps> = (props) => {
	switch (props.type) {
		case ToggleDiffViewType.DEFAULT:
			return (
				<div
					id={DIFFERENCE_ACCOUNT_MESSAGE_ID}
					className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl flex items-center justify-between space-x-4 text-blue-600 dark:text-blue-400"
				>
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
		case ToggleDiffViewType.WARNING:
			return (
				<div
					id={DIFFERENCE_ACCOUNT_MESSAGE_ID}
					className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl flex items-center justify-between space-x-4 text-yellow-600 dark:text-yellow-400"
				>
					<input type="checkbox" checked={props.input.value} onChange={props.input.onChange} className="shrink-0" />
					<div className="space-y-4">
						<p className="text-yellow-900 dark:text-yellow-200 text-lg font-medium">{props.title}</p>
						<div className="space-y-2">
							<p>{props.description}</p>
							<div className="flex items-center justify-between space-x-2">
								<span className="bg-yellow-200 dark:bg-yellow-800 p-1 px-2 rounded-md">{props.cashierAccount}</span>
								<Icon type={props.direction} className="w-5 h-5" />
								<span className="bg-yellow-200 dark:bg-yellow-800 p-1 px-2 rounded-md">{props.diffAccount}</span>
								<span className="font-medium">{props.value}</span>
							</div>
							{props.input.validation && <p className="text-danger text-sm">{props.input.validation}</p>}
						</div>
					</div>
				</div>
			);
		case ToggleDiffViewType.DANGER:
			return (
				<div
					id={DIFFERENCE_ACCOUNT_MESSAGE_ID}
					className="bg-red-100 dark:bg-red-900 p-4 rounded-xl flex items-center justify-between space-x-4 text-red-600 dark:text-red-400"
				>
					<input type="checkbox" checked={props.input.value} onChange={props.input.onChange} className="shrink-0" />
					<div className="space-y-4">
						<p className="text-red-900 dark:text-red-200 text-lg font-medium">{props.title}</p>
						<div className="space-y-2">
							<p>{props.description}</p>
							<div className="flex items-center justify-between space-x-2">
								<span className="bg-red-200 dark:bg-red-800 p-1 px-2 rounded-md">{props.cashierAccount}</span>
								<Icon type={props.direction} className="w-5 h-5" />
								<span className="bg-red-200 dark:bg-red-800 p-1 px-2 rounded-md">{props.diffAccount}</span>
								<span className="font-medium">{props.value}</span>
							</div>
							{props.input.validation && <p className="text-danger text-sm">{props.input.validation}</p>}
						</div>
					</div>
				</div>
			);
	}
};

const DIFFERENCE_ACCOUNT_MESSAGE_ID = 'difference-account-message-id';
