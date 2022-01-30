import React from 'react';
import { useAppState, selectAppState, dispatch } from '../../applicationState';
import { GlobalStateType } from './state';
import { ButtonProps, IconType } from '../../models/props';
import { Icon } from '../../components/icons';
import { ApplicationActionType } from '../../applicationState/actions';

export const GlobalStateWrapper: React.FC = (props) => {
	const appState = useAppState(selectAppState);

	switch (appState.global.type) {
		case GlobalStateType.DEFAULT:
			return <>{props.children}</>;
		case GlobalStateType.LOADING:
			return <LoadingView />;
		case GlobalStateType.ERROR:
			return (
				<ErrorView
					title="Failed To Load Backup"
					message={ERROR_VIEW_MESSAGE}
					reset={{
						type: 'BUTTON_PROPS_TYPE',
						icon: IconType.CLOSE_FILL,
						title: 'Reset',
						onSelect: () => {
							dispatch({
								type: ApplicationActionType.APPLICATION_RESET,
							});
						},
					}}
					backup={{
						type: 'BUTTON_PROPS_TYPE',
						icon: IconType.DOWNLOAD_FILL,
						title: 'Download Backup',
						onSelect: () => {
							dispatch({
								type: ApplicationActionType.APPLICATION_EXPORT,
								exportPayloadType: 'EXPORT_PAYLOAD_TYPE/ALL',
								fileType: 'json',
								dataType: 'all',
							});
						},
					}}
					reload={{
						type: 'BUTTON_PROPS_TYPE',
						icon: IconType.REFRESH_FILL,
						title: 'Reload',
						onSelect: () => {
							window.location.reload();
						},
					}}
				/>
			);
	}
};

const LoadingView = () => (
	<div className="w-screen, h-screen bg-gradient-to-br from-blue-400 via-cyan-200 to-blue-200">
		<div className="w-full h-full flex items-center justify-center">
			<span className="text-blue-500 dark:text-blue-600 text-2xl">Loading...</span>
		</div>
	</div>
);

interface ErrorViewProps {
	title: string;
	message: string;
	reset: ButtonProps;
	backup: ButtonProps;
	reload: ButtonProps;
}

const ErrorView: React.FC<ErrorViewProps> = (props) => (
	<div className="w-screen, h-screen bg-red-400">
		<div className="w-full h-full p-4 flex items-center justify-center">
			<div className="max-w-lg bg-red-600 shadow-lg shadow-red-500/50 rounded-lg p-4 pt-8 space-y-4">
				<h2 className="font-medium text-red-100 text-lg">{props.title}</h2>
				<p className="text-red-200 text-sm">{props.message}</p>
				<div className="flex justify-end space-x-2">
					<button type="button" onClick={props.reset.onSelect} className="button button-sm flex items-center space-x-2">
						{props.reset.icon && <Icon type={props.reset.icon} className="shrink-0 w-5 h-5" />}
						<span className="sr-only sm:not-sr-only">{props.reset.title}</span>
					</button>
					<button
						type="button"
						onClick={props.backup.onSelect}
						className="button button-sm flex items-center space-x-2"
					>
						{props.backup.icon && <Icon type={props.backup.icon} className="shrink-0 w-5 h-5" />}
						<span className="sr-only sm:not-sr-only">{props.backup.title}</span>
					</button>
					<button
						type="button"
						onClick={props.reload.onSelect}
						className="button button-sm button-prime flex items-center space-x-2"
					>
						{props.reload.icon && <Icon type={props.reload.icon} className="shrink-0 w-5 h-5" />}
						<span className="">{props.reload.title}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
);

const ERROR_VIEW_MESSAGE =
	'There was an Error loading the application state from your browsers local storage. Try to "Reload" the the page to fetch any software updates. If you already reloaded the Page, then "Download Backup" and contact the CashBook support. If you no longer need the data from you current application state, then "Reset" start fresh.';
