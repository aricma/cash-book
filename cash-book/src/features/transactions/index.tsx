import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import {
	toCreateTransactionViewProps,
	toTransactionsViewProps,
} from './toProps';
import { CreateTransactionView, TransactionsView } from './views';
import { SlideInModal, OverlayContainer } from '../../components/modal';

export const Transactions: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showCreateView, setShowCreateView] = React.useState(false);
	const transactionsViewProps = toTransactionsViewProps(appState, () =>
		setShowCreateView(true)
	);
	const createTransactionViewProps = toCreateTransactionViewProps(
		appState,
		() => setShowCreateView(false)
	);
	return (
		<>
			<TransactionsView {...transactionsViewProps} />
			<SlideInModal isVisible={showCreateView}>
				<OverlayContainer>
					<CreateTransactionView {...createTransactionViewProps} />
				</OverlayContainer>
			</SlideInModal>
		</>
	);
};
