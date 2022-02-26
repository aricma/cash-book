import React from 'react';
import { dispatch } from '../../applicationState/store';
import { useAppState, selectAppState } from '../../applicationState';
import { SlideInModal, OverlayContainer } from '../../components/modal';
import { CreateAccountView } from './views/createAccountView';
import { AccountsView } from './views/accountsView';
import { makeToCreateAccountViewProps } from './toProps/makeToCreateAccountViewProps';
import { makeToAccountsViewProps } from './toProps/makeToAccountsViewProps';

export const Accounts: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showValidation, setShowValidation] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const accountsViewProps = makeToAccountsViewProps({
		dispatch: dispatch,
		showCreateModel: () => setShowModal(true),
	})(appState.accounts);
	const createAccountViewProps = makeToCreateAccountViewProps(dispatch)(
		appState.accounts,
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
