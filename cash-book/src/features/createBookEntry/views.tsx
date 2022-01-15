import React from 'react';
import {CreateBookEntryViewProps, CreateBookEntryTemplateConfigProps} from './props';
import {DatePickerInput} from '../../components/datePickerInput';
import {TextInput} from '../../components/textInput';
import {Header} from '../menu';
import {Select} from '../../components/select';


export const CreateBookEntryView: React.FC<CreateBookEntryViewProps> = (
    props,
) => {
    return (
        <form className="w-full space-y-4">
            <Header title={props.title}/>
            <Select {...props.template} />
            {props.templateConfig && (<TemplateConfigView {...props.templateConfig} />)}
        </form>
    );
};
const TemplateConfigView: React.FC<CreateBookEntryTemplateConfigProps> = (props) => (
    <>
        <div className="flex flex-col items-center justify-center space-y-2">
            {props.date.input.label && (
                <p className="text-1">{props.date.input.label}</p>
            )}
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    onClick={props.date.yesterday.onSelect}
                    className="button button-sm"
                >
                    {props.date.yesterday.title}
                </button>
                <button
                    type="button"
                    onClick={props.date.today.onSelect}
                    className="button button-sm"
                >
                    {props.date.today.title}
                </button>
            </div>
            <DatePickerInput {...props.date.input} />
        </div>
        {props.transactions.map((inputProps, index) => (
            <React.Fragment key={index}>
                <div className="space-y-1">
                    <TextInput {...inputProps} autoFocus={index === 0} pattern="\d*"/>
                </div>
            </React.Fragment>
        ))}
        {props.valueValidation && (
            <p className="ml-2 text-danger text-sm">{props.valueValidation}</p>
        )}
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
    </>
);
