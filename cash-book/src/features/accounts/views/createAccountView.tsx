import React from 'react';
import {CreateAccountViewProps} from '../props/createAccountViewProps';
import {Header} from '../../menu';
import {Icon} from '../../../components/icons';
import {Select} from '../../../components/select';
import {TextInput} from '../../../components/textInput';


export const CreateAccountView: React.FC<CreateAccountViewProps> = (props) => (
    <div className="p-4 space-y-4">
        <Header
            title={props.title}
            right={() => (
                <div className="flex items-center justify-end">
                    <button type="button" onClick={props.close.onSelect} className="link link-sm">
                        {props.close.icon && <Icon type={props.close.icon} className="w-5 h-5"/>}
                        <span className="sr-only">{props.close.title}</span>
                    </button>
                </div>
            )}
        />
        <div className="flex items-start space-x-2">
            <div>
                <Select {...props.type} />
                {props.type.validation && <span className="ml-2 text-sm text-danger">{props.type.validation}</span>}
            </div>
            <div>
                <TextInput {...props.name} />
            </div>
            <div>
                <TextInput {...props.number} pattern="\d*"/>
            </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
            <button type="button" onClick={props.cancel.onSelect} className="button button-md">
                {props.cancel.title}
            </button>
            {props.submit.type === 'BUTTON_PROPS_TYPE' ? (
                <button type="button" onClick={props.submit.onSelect} className="button-prime button-md">
                    {props.submit.title}
                </button>
            ) : (
                <button type="button" disabled className="button button-md">
                    {props.submit.title}
                </button>
            )}
        </div>
    </div>
);
