import React from 'react';
import { ApplicationActionType } from '../applicationState/actions';
import { dispatch } from '../applicationState/store';

export const ResolveStateFromLocalStorage: React.FC = (props) => {
	React.useEffect(() => {
		dispatch({ type: ApplicationActionType.APPLICATION_LOAD });
		// eslint-disable-next-line
	}, []);

	return <>{props.children}</>;
};
