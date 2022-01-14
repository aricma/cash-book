import React from 'react';
import { dispatch } from '../applicationState';
import { ApplicationActionType } from '../applicationState/actions';

export const ResolveStateFromLocalStorage: React.FC = (props) => {
	React.useEffect(() => {
		dispatch({ type: ApplicationActionType.APPLICATION_LOAD });
		// eslint-disable-next-line
	}, []);

	return <>{props.children}</>;
};
