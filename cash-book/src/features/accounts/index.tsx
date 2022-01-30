import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { SlideInModal, OverlayContainer } from '../../components/modal';
import { CreateAccountView } from './views/createAccountView';
import { AccountsView } from './views/accountsView';
import { toCreateAccountViewProps } from './toProps/toCreateAccountViewProps';
import { toAccountsViewProps } from './toProps/toAccountsViewProps';

export const Accounts: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showValidation, setShowValidation] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const accountsViewProps = toAccountsViewProps(appState, () => setShowModal(true));
	const createAccountViewProps = toCreateAccountViewProps(
		appState,
		showValidation,
		() => setShowValidation((prv) => !prv),
		() => setShowModal(false)
	);
	return (
		<>
			<AccountsView {...accountsViewProps} />
			<SlideInModal isVisible={showModal}>
				<OverlayContainer>
					<CreateAccountView {...createAccountViewProps} />
				</OverlayContainer>
			</SlideInModal>
		</>
	);
};
