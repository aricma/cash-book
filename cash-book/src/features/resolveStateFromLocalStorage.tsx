import React from 'react';
import { dispatch } from '../applicationState';
import { ApplicationActionType } from '../applicationState/actions';

export const ResolveStateFromLocalStorage: React.FC = (props) => {
	const [loading, set] = React.useState(true);
	React.useEffect(() => {
		set(true);
		dispatch({ type: ApplicationActionType.APPLICATION_LOAD });
		setTimeout(() => set(false), 1500);
		// eslint-disable-next-line
	}, []);

	if (loading) {
		return <LoadingView />
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
