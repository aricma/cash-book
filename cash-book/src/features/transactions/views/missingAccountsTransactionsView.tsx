import React from 'react';
import {MissingAccountsTransactionsViewProps} from '../props/transactionsViewProps';
import {Header} from '../../../components/header';
import {Icon} from '../../../components/icons';
import {IconType} from '../../../models/props';
import {ExternalLink} from '../../../components/externalLink';
import {TemplatesSkeleton} from './skeletonTransactionsView';


export const MissingAccountsTransactionsView: React.FC<MissingAccountsTransactionsViewProps> = (props) => {
    return (
        <div className="space-y-12 pb-[100px]">
            <Header title={props.title}/>
            <div className="bg-orange-100 dark:bg-orange-600 text-orange-600 dark:text-orange-200 rounded-md p-4 space-y-2">
                <h3 className="text-lg font-medium flex space-x-2">
                    <Icon type={IconType.EXCLAMATION_STROKE} className="w-6"/>
                    <span className="">{props.warningBox.title}</span>
                </h3>
                <p className="">
                    {
                        props.warningBox.message.map((props, index) => {
                            switch (props.type) {
                                case 'BUTTON_PROPS_TYPE':
                                    return (
                                        <React.Fragment key={index}>
                                            <button type="button" onClick={props.onSelect}
                                                    className="button-prime bg-orange-600 dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-400 focus:ring-orange-600 dark:focus:ring-orange-500 text-orange-100 dark:text-orange-200 button-xs py-1 inline-flex items-center justify-center space-x-2">
                                                {props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
                                                <span className="leading-5">{props.title}</span>
                                            </button>
                                        </React.Fragment>
                                    );
                                // case 'DISABLED_BUTTON_PROPS_TYPE':
                                case 'LINK_PROPS_TYPE':
                                    return (
                                        <React.Fragment key={index}>
                                            <ExternalLink {...props}
                                                          className="button-prime bg-orange-600 dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-400 focus:ring-orange-600 dark:focus:ring-orange-500 text-orange-100 dark:text-orange-200 button-xs py-1 inline-flex items-center justify-center space-x-2">
                                                {props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
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
                        })
                    }
                </p>
            </div>
            <div className="space-y-4">
                <TemplatesSkeleton/>
            </div>
        </div>
    );
};
