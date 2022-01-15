import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { SlideInModal, OverlayContainer } from '../../components/modal';
import { toAccountsViewProps, toCreateAccountViewProps } from './toProps';
import { CreateAccountView, AccountsView } from './views';

export const Accounts: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showCreate, setShowCreate] = React.useState(false);
	const accountsViewProps = toAccountsViewProps(appState, () => setShowCreate(true));
	const createAccountViewProps = toCreateAccountViewProps(appState, () => setShowCreate(false));
	return (
		<>
			<AccountsView {...accountsViewProps} />
			<SlideInModal isVisible={showCreate}>
				<OverlayContainer>
					<CreateAccountView {...createAccountViewProps} />
				</OverlayContainer>
			</SlideInModal>
		</>
	);
};
