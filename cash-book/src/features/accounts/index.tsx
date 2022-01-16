import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { SlideInModal, OverlayContainer } from '../../components/modal';
import { toAccountsViewProps, toCreateAccountViewProps } from './toProps';
import { CreateAccountView, AccountsView } from './views';

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
