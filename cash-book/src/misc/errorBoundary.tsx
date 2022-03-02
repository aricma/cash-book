import React, { ErrorInfo } from 'react';
import { ApplicationActionType } from '../applicationState/actions';
import { dispatch } from '../applicationState/store';
import { IS_DEVELOPMENT_ENVIRONMENT } from '../variables/environments';
import { CashBookError, CashBookErrorType } from '../models/cashBookError';

export class ErrorBoundary extends React.Component {
	state: {
		hasError: boolean;
	};

	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error) {
		return {
			hasError: true,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// eslint-disable-next-line
		if (IS_DEVELOPMENT_ENVIRONMENT) console.log(error, errorInfo);
		dispatch({
			type: ApplicationActionType.APPLICATION_ERROR_SET,
			error: new CashBookError(CashBookErrorType.UNKNOWN, error),
		});
	}

	render() {
		if (IS_DEVELOPMENT_ENVIRONMENT && this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return this.props.children;
	}
}
