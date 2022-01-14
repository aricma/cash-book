import React from 'react';
import {CreateTransactionViewProps, TransactionsViewProps} from './props';
import {Icon} from '../../components/icons';
import {Select} from '../../components/select';
import {ButtonProps} from '../../models/props';
import {TextInput} from '../../components/textInput';
import {Header} from '../menu';


export const TransactionsView: React.FC<TransactionsViewProps> = (props) => {
    return (
        <div className="space-y-12">
            <Header title={props.title}>
                <div className="flex items-center justify-end">
                    <button type="button" onClick={props.create.onSelect} className="button-prime button-xs">
                        {props.create.icon && (<Icon type={props.create.icon} className="w-5 h-5"/>)}
                        <span className="sr-only">{props.create.title}</span>
                    </button>
                </div>
            </Header>
            <div className="space-y-2">
                {props.transactions.transactions.map((transactionViewProps, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="flex items-center space-x-2">
                                <span className="text-2">{transactionViewProps.order}</span>
                                <div
                                    className="flex-grow bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-md shadow-md shadow-blue-600/30 dark:shadow-gray-900 py-2 pl-4 pr-2">
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="">
                                            <span
                                                className="font-bold">{transactionViewProps.title}</span>
                                            <div className="text-sm flex items-center space-x-2 dark:text-blue-400">
                                                <span>{transactionViewProps.cashStation.title}</span>
                                                <Icon type={transactionViewProps.direction} className="w-6 h-6"/>
                                                <span>{transactionViewProps.otherAccount.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <Button {...transactionViewProps.decreaseOrder} />
                                            <Button {...transactionViewProps.increaseOrder} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            type="button"
            onClick={props.onSelect}
            className="button-prime button-xs p-1 bg-blue-300 dark:bg-blue-800 hover:text-white !ring-offset-blue-200 dark:!ring-offset-blue-900">
            {props.icon && (<Icon type={props.icon} className="w-5 h-5"/>)}
            <span className="sr-only">{props.title}</span>
        </button>
    );
};

export const CreateTransactionView: React.FC<CreateTransactionViewProps> = props => (
    <div className="p-4 space-y-8">
        <Header title={props.title}>
            <div className="flex items-center justify-end">
                <button type="button" onClick={props.close.onSelect} className="link link-sm">
                    {props.close.icon && (<Icon type={props.close.icon} className="w-5 h-5"/>)}
                    <span className="sr-only">{props.close.title}</span>
                </button>
            </div>
        </Header>
        <div className="flex items-start space-x-2">
            <div>
                <TextInput autoFocus {...props.name} />
            </div>
            <div className="grid grid-cols-[1fr_max-content_1fr] gap-2">
                <div className="flex items-center justify-center">
                    <Select {...props.cashStation} />
                </div>
                <div className="flex items-center justify-center">
                    <button type="button" onClick={props.type.onSelect} className="button button-md p-2">
                        {props.type.icon && (<Icon type={props.type.icon} className="w-6 h-6"/>)}
                        <span className="sr-only">{props.type.title}</span>
                    </button>
                </div>
                <div className="flex items-center justify-center">
                    <Select {...props.otherAccount} />
                </div>

                <span className="ml-2 text-sm text-danger">{props.cashStation.validation}</span>
                <div/>
                <span className="ml-2 text-sm text-danger">{props.otherAccount.validation}</span>
            </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
            <button
                type="button"
                onClick={props.cancel.onSelect}
                className="button button-md"
            >
                {props.cancel.title}
            </button>
            {
                props.submit.type === 'BUTTON_PROPS_TYPE' ? (
                    <button
                        type="button"
                        onClick={props.submit.onSelect}
                        className="button-prime button-md">
                        {props.submit.title}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled
                        className="button-disabled button-md">
                        {props.submit.title}
                    </button>
                )
            }
        </div>
    </div>
);
