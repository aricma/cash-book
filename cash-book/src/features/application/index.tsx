import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { GlobalStateType } from './state';

export const GlobalStateWrapper: React.FC = (props) => {
	const appState = useAppState(selectAppState);

	if (appState.global.type === GlobalStateType.LOADING) {
		return <LoadingView />;
	} else {
		return <>{props.children}</>;
	}
};

const LoadingView = () => (
	<div className="w-screen, h-screen bg-gradient-to-br from-blue-400 via-cyan-200 to-blue-200">
		<div className="w-full h-full flex items-center justify-center">
			<span className="text-blue-500 dark:text-blue-600 text-2xl">Loading...</span>
		</div>
	</div>
);
