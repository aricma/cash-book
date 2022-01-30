import React from 'react';
import { TransactionsViewProps, TransactionsViewType } from '../props/transactionsViewProps';
import { DataTransactionsView } from './dataTransactionsView';
import { MissingAccountsTransactionsView } from './missingAccountsTransactionsView';
import { SkeletonTransactionsView } from './skeletonTransactionsView';

export const TransactionsView: React.FC<TransactionsViewProps> = (props) => {
	switch (props.type) {
		case TransactionsViewType.SKELETON:
			return <SkeletonTransactionsView {...props} />;
		case TransactionsViewType.MISSING_ACCOUNTS:
			return <MissingAccountsTransactionsView {...props} />;
		case TransactionsViewType.DATA:
			return <DataTransactionsView {...props} />;
		default:
			return null;
	}
};
