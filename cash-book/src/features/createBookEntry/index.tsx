import React from 'react';
import { useAppState, selectAppState } from '../../applicationState';
import { toCreateBookEntryViewProps } from './toProps/toCreateBookEntryViewProps';
import { CreateBookEntryView } from './views/createBookEntryView';
import { AppearModal, DialogContainer } from '../../components/modal';
import { Dialog } from './views/dialog';
import { toOverrideDateConfirmationModalViewProps } from './toProps/toOverrideDateConfirmationModalViewProps';

export const CreateBookEntry: React.FC = () => {
	const appState = useAppState(selectAppState);
	const [showDateOverrideConfirmationModal, setShowDateOverrideConfirmationModal] = React.useState(false);
	const [showValidation, setShowValidation] = React.useState(false);
	const viewProps = toCreateBookEntryViewProps({
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
