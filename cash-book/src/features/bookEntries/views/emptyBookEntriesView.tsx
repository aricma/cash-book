import React from 'react';
import {NoTemplateBookEntriesViewProps, NoTemplatesBookEntriesViewProps, BookEntriesViewType} from '../props';
import {Header} from '../../../components/header';
import {Icon} from '../../../components/icons';
import {ExternalLink} from '../../../components/externalLink';
import {Select, OptionsType} from '../../../components/select';


export const EmptyBookEntriesView: React.FC<NoTemplateBookEntriesViewProps | NoTemplatesBookEntriesViewProps> = (
    props,
) => {
    switch (props.type) {
        case BookEntriesViewType.NO_TEMPLATE:
            return (
                <div className="space-y-12 pb-[100px]">
                    <Header
                        title={props.title}
                        left={
                            <div className="flex items-center justify-start">
                                <Select {...props.template} optionsType={OptionsType.BL} />
                            </div>
                        }
                    />
                    <div
                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md p-4 space-y-2">
                        <h3 className="text-lg font-medium dark:text-blue-300">{props.infoBox.title}</h3>
                        <p className="">
                            {props.infoBox.message.map((props, index) => {
                                switch (props.type) {
                                    case 'BUTTON_PROPS_TYPE':
                                        return (
                                            <React.Fragment key={index}>
                                                <button
                                                    type="button"
                                                    onClick={props.onSelect}
                                                    className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2"
                                                >
                                                    {props.icon && <Icon type={props.icon} className="w-4 h-4"/>}
                                                    <span className="leading-5">{props.title}</span>
                                                </button>
                                            </React.Fragment>
                                        );
                                    case 'LINK_PROPS_TYPE':
                                        return (
                                            <React.Fragment key={index}>
                                                <ExternalLink
                                                    {...props}
                                                    className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2"
                                                >
                                                    {props.icon && <Icon type={props.icon} className="w-4 h-4"/>}
                                                    <span className="leading-5">{props.title}</span>
                                                </ExternalLink>
                                            </React.Fragment>
                                        );
                                    case 'SPAN_PROPS_TYPE':
                                        return (
                                            <React.Fragment key={index}>
                                                <span className="leading-8">{props.title}</span>
                                            </React.Fragment>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </p>
                    </div>
                </div>
            );
        case BookEntriesViewType.NO_TEMPLATES:
            return (
                <div className="space-y-12 pb-[100px]">
                    <Header title={props.title}/>
                </div>
            );
    }
};
