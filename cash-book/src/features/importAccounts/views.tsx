import React from 'react';
import {ImportAccountsViewProps, ImportAccountsModalViewProps} from './props';
import {FileInput} from '../../components/fileInput';
import {Icon} from '../../components/icons';
import {SlideInModal, OverlayContainer} from '../../components/modal';
import {Header} from '../menu';
import {AccountsTableView} from '../accounts/views';
import {IconType} from '../../models/props';


export const ImportAccountsView: React.FC<ImportAccountsViewProps> = (props) => (
    <>
        <FileInput
            {...props.file.input}
            accept="text/csv"
            button={({isLoading, onSelect}) => isLoading || props.file.button.type === 'DISABLED_BUTTON_PROPS_TYPE' ? (
                <button type="button" disabled className="button-disabled button-xs">
                    <Icon type={IconType.SPINNER} className="w-5 h-5"/>
                    <span className="sr-only">{props.file.button.title}</span>
                </button>
            ) : (
                <button type="button" onClick={onSelect} className="button-prime button-xs">
                    {props.file.button.icon && (<Icon type={props.file.button.icon} className="w-5 h-5"/>)}
                    <span className="sr-only">{props.file.button.title}</span>
                </button>
            )}
        />
        <SlideInModal isVisible={props.modal.isVisible}>
            <OverlayContainer>
                <ImportAccountsModalView {...props.modal} />
            </OverlayContainer>
        </SlideInModal>
    </>
);

const ImportAccountsModalView: React.FC<ImportAccountsModalViewProps> = (props) => (
    <div className="p-4 space-y-8">
        <Header title={props.title}>
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={props.close.onSelect}
                    className="link link-sm">
                    {props.close.icon && (
                        <Icon type={props.close.icon} className="w-5 h-5"/>
                    )}
                    <span className="sr-only">{props.close.title}</span>
                </button>
            </div>
        </Header>
        <AccountsTableView accounts={props.accounts}/>
        <div className="flex items-center justify-end space-x-2">
            <button
                type="button"
                onClick={props.cancel.onSelect}
                className="button button-md"
            >
                {props.cancel.title}
            </button>
            {props.submit.type === 'BUTTON_PROPS_TYPE' ? (
                <button
                    type="button"
                    onClick={props.submit.onSelect}
                    className="button-prime button-md"
                >
                    {props.submit.title}
                </button>
            ) : (
                <button type="button" disabled className="button-disabled button-md">
                    {props.submit.title}
                </button>
            )}
        </div>
    </div>
);
