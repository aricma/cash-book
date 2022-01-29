import React from 'react';
import {CreateBookEntryTemplateConfigProps} from '../props';
import {DatePickerInput} from '../../../components/datePickerInput';
import {TextInput} from '../../../components/textInput';
import {DifferenceAccount} from './differenceAccount';


export const TemplateConfigView: React.FC<CreateBookEntryTemplateConfigProps> = (props) => (
    <>
        <div className="flex flex-col items-center justify-center space-y-2">
            {props.date.input.label && <p className="text-1">{props.date.input.label}</p>}
            <div className="flex items-center space-x-2">
                <button type="button" onClick={props.date.yesterday.onSelect} className="button button-sm">
                    {props.date.yesterday.title}
                </button>
                <button type="button" onClick={props.date.today.onSelect} className="button button-sm">
                    {props.date.today.title}
                </button>
            </div>
            <DatePickerInput {...props.date.input} />
        </div>
        <TextInput {...props.cashStart} autoFocus pattern="\d*" onBlur={props.cashStart.onFinish}/>
        {props.transactions.map((inputProps, index) => (
            <React.Fragment key={index}>
                <div className="space-y-1">
                    <TextInput {...inputProps} pattern="\d*" onBlur={inputProps.onFinish}/>
                </div>
            </React.Fragment>
        ))}
        <TextInput {...props.cashEnd} pattern="\d*" onBlur={props.cashEnd.onFinish}/>
        {props.diffTransaction && <DifferenceAccount {...props.diffTransaction} />}
        <div className="flex items-center justify-end space-x-2">
            <button type="button" onClick={props.cancel.onSelect} className="button button-md">
                {props.cancel.title}
            </button>
            {props.submit.type === 'BUTTON_PROPS_TYPE' ? (
                <button type="button" onClick={props.submit.onSelect} className="button-prime button-md">
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
