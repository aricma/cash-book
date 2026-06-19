import React from 'react';
import { ApplicationActionType } from '../applicationState/actions';
import { dispatch } from '../applicationState/store';

type Props = {
  children?: React.ReactNode;
};

export const ResolveStateFromLocalStorage: React.FC<Props> = (props) => {
	React.useEffect(() => {
		dispatch({ type: ApplicationActionType.APPLICATION_LOAD });

	}, []);

	return <>{props.children}</>;
};
