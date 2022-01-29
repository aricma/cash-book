import React from 'react';
import {TransactionViewProps} from '../props/transactionsViewProps';
import {Icon} from '../../../components/icons';
import {Button} from './button';


export const TransactionView: React.FC<TransactionViewProps> = (props) => {
    return (
        <div
            className="flex-grow bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-md shadow-md shadow-blue-600/30 dark:shadow-gray-900 py-2 pl-4 pr-2">
            <div className="flex items-center justify-between space-x-2">
                <div className="">
                    <span className="font-bold">{props.title}</span>
                    <div className="text-sm flex items-center space-x-2 dark:text-blue-400">
                        <span>{props.cashStation.title}</span>
                        <Icon type={props.direction} className="w-6 h-6"/>
                        <span>{props.otherAccount.title}</span>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <Button {...props.decreaseOrder} />
                    <Button {...props.increaseOrder} />
                </div>
            </div>
        </div>
    );
};
