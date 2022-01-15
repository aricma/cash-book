import React from 'react';
import {
    CreateTransactionViewProps,
    TransactionsViewProps,
    TemplateViewProps,
    TransactionViewProps,
    CreateTemplateViewProps,
} from './props';
import {ButtonProps} from '../../models/props';
import {TextInput} from '../../components/textInput';
import {Select} from '../../components/select';
import {Icon} from '../../components/icons';
import {Header} from '../menu';


export const TransactionsView: React.FC<TransactionsViewProps> = (props) => {
    return (
        <div className="space-y-12 pb-[100px]">
            <Header title={props.title}>
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={props.create.onSelect}
                        className="button-prime button-xs"
                    >
                        {props.create.icon && (
                            <Icon type={props.create.icon} className="w-5 h-5"/>
                        )}
                        <span className="sr-only">{props.create.title}</span>
                    </button>
                </div>
            </Header>
            <div className="space-y-8">
                {props.templates.map((templateViewProps, index) => (
                    <React.Fragment key={index}>
                        <TemplateView {...templateViewProps} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const TemplateView: React.FC<TemplateViewProps> = props => (
    <div className="space-y-2">
        <div className="flex items-center justify-between space-x-2">
            <p className="text-2 text-lg font-medium">{props.title}</p>
            <button type="button" onClick={props.edit.onSelect} className="button-prime button-xs">
                {props.edit.icon && (<Icon type={props.edit.icon} className="w-5 h-5"/>)}
                <span className="sr-only">{props.edit.title}</span>
            </button>
        </div>
        <div className="grid grid-cols-[max-content_1fr] gap-2">
            {
                props.transactions.map((transactionsViewProps, index) => (
                    <React.Fragment key={index}>
                        <TransactionView {...transactionsViewProps} />
                    </React.Fragment>
                ))
            }
        </div>
    </div>
);

const TransactionView: React.FC<TransactionViewProps> = props => (
    <>
        <div className="flex items-center justify-end">
            <span className="text-2">{props.order}</span>
        </div>
        <div
            className="flex-grow bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-md shadow-md shadow-blue-600/30 dark:shadow-gray-900 py-2 pl-4 pr-2">
            <div className="flex items-center justify-between space-x-2">
                <div className="">
											<span className="font-bold">
												{props.title}
											</span>
                    <div className="text-sm flex items-center space-x-2 dark:text-blue-400">
                        <span>{props.cashStation.title}</span>
                        <Icon
                            type={props.direction}
                            className="w-6 h-6"
                        />
                        <span>{props.otherAccount.title}</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <Button {...props.decreaseOrder} />
                    <Button {...props.increaseOrder} />
                </div>
            </div>
        </div>
    </>
);

export const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            type="button"
            onClick={props.onSelect}
            className="button-prime button-xs p-1 bg-blue-300 dark:bg-blue-800 hover:text-white !ring-offset-blue-200 dark:!ring-offset-blue-900"
        >
            {props.icon && <Icon type={props.icon} className="w-5 h-5"/>}
            <span className="sr-only">{props.title}</span>
        </button>
    );
};

export const CreateTemplateView: React.FC<CreateTemplateViewProps> = props => (
    <div className="h-full pb-[100px] flex flex-col">
        <div className="flex-shrink-0 p-4">
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
        </div>
        <div className="flex-grow pb-[100px] space-y-8 overflow-auto p-4">
            <div className="space-y-2">
                <TextInput autoFocus {...props.name} />
                <Select {...props.cashierAccount} />
                <Select {...props.diffAccount} />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between space-x-2">
                    <h3 className="text-lg text-2">Transactions</h3>
                    {
                        props.addTransaction && (
                            <button type="button" onClick={props.addTransaction.onSelect}
                                    className="button-prime button-xs">
                                {props.addTransaction.icon && (
                                    <Icon type={props.addTransaction.icon} className="w-5 h-5"/>
                                )}
                                <span className="sr-only">{props.addTransaction.title}</span>
                            </button>
                        )
                    }
                </div>
                <div className="grid grid-cols-[max-content_1fr] gap-2">
                    {
                        props.transactions && props.transactions.map((transactionConfig, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center justify-end">
                                    <span className="text-2">{transactionConfig.order}</span>
                                </div>
                                <CreateTransactionView {...transactionConfig} />
                            </React.Fragment>
                        ))
                    }
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
    </div>
);

export const CreateTransactionView: React.FC<CreateTransactionViewProps> = (props) => (
    <div className="p-4 rounded-xl border-4 border-blue-200 dark:border-blue-900 flex space-x-2">
        <div className="flex-grow space-y-2">
            <TextInput autoFocus {...props.name} />
            <div className="flex items-end space-x-2">
                <div className="">
                    <div className="button-still button-md">{props.cashierAccount}</div>
                </div>
                <div className="flex-shrink-0">
                    <button
                        type="button"
                        onClick={props.type.onSelect}
                        className="button rounded-md p-2">
                        {props.type.icon && (
                            <Icon type={props.type.icon} className="w-6 h-6"/>
                        )}
                        <span className="sr-only">{props.type.title}</span>
                    </button>
                </div>
                <div className="flex-grow">
                    <Select {...props.account} />
                    {props.account.validation && (
                        <span className="ml-2 text-sm text-danger">{props.account.validation}</span>)}
                </div>
            </div>
        </div>
        <div className="flex-shrink-0">
            <div className="h-full flex flex-col items-center justify-between">
                <button type="button" onClick={props.remove.onSelect} className="hover:text-blue-500">
                    {props.remove.icon && (<Icon type={props.remove.icon} className="w-5 h-5"/>)}
                    <span className="sr-only">{props.remove.title}</span>
                </button>
                <div className="flex flex-col space-y-1">
                    <Button {...props.decreaseOrder} />
                    <Button {...props.increaseOrder} />
                </div>
            </div>
        </div>
    </div>
);
