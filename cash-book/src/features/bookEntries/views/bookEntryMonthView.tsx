import React from 'react';
import {BookEntryMonthViewProps} from '../props';
import {Icon} from '../../../components/icons';
import {BookEntryDayView} from './bookEntryDayView';


export const BookEntryMonthView: React.FC<BookEntryMonthViewProps> = (props) => {
    return (
        <div>
            <div className="w-full block text-1 button-xs flex items-center justify-between space-x-2">
                <p className="font-medium text-xl">{props.date}</p>
                <button type="button" onClick={props.export.onSelect} className="">
                    {props.export.icon && <Icon type={props.export.icon} className="w-5 h-5"/>}
                    <span className="sr-only">{props.export.title}</span>
                </button>
            </div>
            <div className="space-y-4">
                {props.entries.map((bookEntryMonthViewProps, index) => (
                    <React.Fragment key={index}>
                        <BookEntryDayView {...bookEntryMonthViewProps} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
