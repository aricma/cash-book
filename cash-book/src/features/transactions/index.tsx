import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { toTransactionsViewProps, toCreateTemplateViewProps } from './toProps';
import { TransactionsView, CreateTemplateView } from './views';
import { SlideInModal, OverlayContainer } from '../../components/modal';

export const Transactions: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showCreateView, setShowCreateView] = React.useState(false);
	const transactionsViewProps = toTransactionsViewProps(appState, () => setShowCreateView(true));
	const createTemplateViewProps = toCreateTemplateViewProps(appState, () => setShowCreateView(false));
	return (
		<>
			<TransactionsView {...transactionsViewProps} />
			<SlideInModal isVisible={showCreateView}>
				<OverlayContainer>
					<CreateTemplateView {...createTemplateViewProps} />
				</OverlayContainer>
			</SlideInModal>
		</>
	);
};
