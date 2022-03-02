import React from 'react';
import { ErrorViewProps } from './props';
import { Icon } from '../../components/icons';

export const LoadingView = () => (
	<div className="w-screen, h-screen bg-gradient-to-br from-blue-400 via-cyan-200 to-blue-200">
		<div className="w-full h-full flex items-center justify-center">
			<span className="text-blue-500 dark:text-blue-600 text-2xl">Loading...</span>
		</div>
	</div>
);

export const ErrorView: React.FC<ErrorViewProps> = (props) => (
	<div className="w-screen, h-screen bg-red-400">
		<div className="w-full h-full p-4 flex items-center justify-center">
			<div className="max-w-lg bg-red-600 shadow-lg shadow-red-500/50 rounded-lg p-4 pt-8 space-y-4">
				<h2 className="font-medium text-red-100 text-lg">{props.title}</h2>
				<p className="text-red-200 text-sm">{props.message}</p>
				<div className="sm:flex sm:flex-wrap sm:justify-end">
					{props.buttons.map((buttonProps) => {
						return (
							<div key={buttonProps.title} className="w-full sm:w-auto p-1">
								<button
									type="button"
									onClick={buttonProps.onSelect}
									className="w-full button button-sm flex items-center justify-center space-x-2"
								>
									{buttonProps.icon && <Icon type={buttonProps.icon} className="shrink-0 w-5 h-5" />}
									<span className="sr-only not-sr-only">{buttonProps.title}</span>
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	</div>
);
