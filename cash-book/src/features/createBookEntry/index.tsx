import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { makeToCreateBookEntryViewProps } from './toProps/makeToCreateBookEntryViewProps';
import { CreateBookEntryView } from './views/createBookEntryView';
import { AppearModal, DialogContainer } from '../../components/modal';
import { Dialog } from './views/dialog';
import { toOverrideDateConfirmationModalViewProps } from './toProps/toOverrideDateConfirmationModalViewProps';
import { dispatch } from '../../applicationState/store';

export const CreateBookEntry: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showDateOverrideConfirmationModal, setShowDateOverrideConfirmationModal] = React.useState(false);
	const [showValidation, setShowValidation] = React.useState(false);
	const viewProps = makeToCreateBookEntryViewProps({
		dispatch: dispatch,
		appState: appState,
		showValidation: showValidation,
		setShowValidation: () => setShowValidation(true),
		openDateOverrideConfirmationModal: () => setShowDateOverrideConfirmationModal(true),
	});
	const modalViewProps = toOverrideDateConfirmationModalViewProps(appState, () =>
		setShowDateOverrideConfirmationModal(false)
	);
	return (
		<>
			<CreateBookEntryView {...viewProps} />
			<AppearModal isVisible={showDateOverrideConfirmationModal}>
				<DialogContainer>{modalViewProps && <Dialog {...modalViewProps} />}</DialogContainer>
			</AppearModal>
		</>
	);
};
