import React from 'react';
import { GlobalStateType } from './state';
import { useAppState, selectAppState } from '../../applicationState';
import { dispatch } from '../../applicationState/store';
import { ErrorViewProps } from './props';
import { makeToErrorViewProps } from './toProps';
import { ErrorView, LoadingView } from './views';

export const GlobalStateWrapper: React.FC = (props) => {
	const appState = useAppState(selectAppState);

	switch (appState.global.type) {
		case GlobalStateType.DEFAULT:
			return <>{props.children}</>;
		case GlobalStateType.LOADING:
			return <LoadingView />;
		case GlobalStateType.ERROR:
			const errorViewProps: ErrorViewProps = makeToErrorViewProps(dispatch)(appState.global.error);
			return <ErrorView {...errorViewProps} />;
	}
};
