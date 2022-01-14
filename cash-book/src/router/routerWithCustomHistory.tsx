import * as ReactRouter from 'react-router-dom';
import React from 'react';
import { History, Action, Location } from 'history';

export interface CustomRouterProps {
	basename?: string;
}

export const MakeRouterWithHistory = (
	history: History
): React.FC<CustomRouterProps> => {
	return function Router(props) {
		interface RouterState {
			action: Action;
			location: Location;
		}

		const [state, setState] = React.useState<RouterState>({
			action: history.action,
			location: history.location,
		});

		React.useLayoutEffect(() => {
			history.listen((historyObject) =>
				setState({
					action: historyObject.action,
					location: historyObject.location,
				})
			);
			// eslint-disable-next-line
		}, []);

		return (
			<ReactRouter.Router
				basename={props.basename}
				location={state.location}
				navigationType={state.action}
				navigator={history}
			>
				{props.children}
			</ReactRouter.Router>
		);
	};
};
