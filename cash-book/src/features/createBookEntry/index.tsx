import React from 'react';
import {OverrideDateConfirmationModalViewProps} from './props';
import {useAppState, selectAppState} from '../../applicationState';
import {toCreateBookEntryViewProps, toOverrideDateConfirmationModalViewProps} from './toProps';
import {CreateBookEntryView} from './views';
import {AppearModal, DialogContainer} from '../../components/modal';


export const CreateBookEntry: React.FC = () => {
    const appState = useAppState(selectAppState);
    const [showDateOverrideConfirmationModal, setShowDateOverrideConfirmationModal] = React.useState(false);
    const [showValidation, setShowValidation] = React.useState(false);
    const viewProps = toCreateBookEntryViewProps(
        appState,
        showValidation,
        () => setShowValidation(true),
        () => setShowDateOverrideConfirmationModal(true),
    );
    const modalViewProps = toOverrideDateConfirmationModalViewProps(appState, () => setShowDateOverrideConfirmationModal(false));
    return (
        <>
            <CreateBookEntryView {...viewProps} />
            <AppearModal isVisible={showDateOverrideConfirmationModal}>
                <DialogContainer>
                    <Dialog {...modalViewProps} />
                </DialogContainer>
            </AppearModal>
        </>
    );
};

const Dialog: React.FC<OverrideDateConfirmationModalViewProps> = props => (
    <div className="p-4 pt-8 space-y-2">
        <h3 className="text-lg font-medium text-1">{props.title}</h3>
        <p className="text-2 text-sm">{props.message}</p>
        <div className="flex items-center justify-end space-x-2">
            <button type="button" onClick={props.cancel.onSelect} className="button button-xs">
                {props.cancel.title}
            </button>
            <button type="button" onClick={props.submit.onSelect} className="button-prime button-xs">
                {props.submit.title}
            </button>
        </div>
    </div>
);

