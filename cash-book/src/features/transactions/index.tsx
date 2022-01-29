import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { toTransactionsViewProps} from './toProps/toTransactionsViewProps';
import { TransactionsView} from './views/transactionsView';
import { SlideInModal, OverlayContainer } from '../../components/modal';
import {toCreateTemplateViewProps} from './toProps/toCreateTemplateViewProps';
import {CreateTemplateView} from './views/createTemplateView';

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
