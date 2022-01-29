import React from 'react';
import {AccountsViewProps, AccountsViewType} from '../props/accountsViewProps';
import {Icon} from '../../../components/icons';
import {Accounts, AccountsSkeleton} from './accounts';
import {Header} from '../../../components/header';
import {ExternalLink} from '../../../components/externalLink';


export const AccountsView: React.FC<AccountsViewProps> = (props) => {
    switch (props.type) {
        case AccountsViewType.SKELETON:
            return (
                <div className="space-y-12">
                    <Header
                        title={props.title}
                        right={
                            <div className="flex items-center justify-end space-x-2">
                                <button type="button" onClick={props.create.onSelect}
                                        className="button-prime button-xs">
                                    {props.create.icon && <Icon type={props.create.icon} className="w-5 h-5"/>}
                                    <span className="sr-only">{props.create.title}</span>
                                </button>
                            </div>
                        }
                    />
                    <div className="bg-blue-100 text-blue-600 rounded-md p-4 space-y-2">
                        <h3 className="text-lg font-medium">{props.infoBox.title}</h3>
                        <p className="">
                            {
                                props.infoBox.message.map((props, index) => {
                                    switch (props.type) {
                                        case 'BUTTON_PROPS_TYPE':
                                            return (
                                                <React.Fragment key={index}>
                                                    <button type="button" onClick={props.onSelect} className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2">
                                                        {props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
                                                        <span className="leading-5">{props.title}</span>
                                                    </button>
                                                </React.Fragment>
                                            );
                                        // case 'DISABLED_BUTTON_PROPS_TYPE':
                                        case 'LINK_PROPS_TYPE':
                                            return (
                                                <React.Fragment key={index}>
                                                    <ExternalLink {...props} className="button-prime button-xs py-1 inline leading-5">
                                                        {props.title}
                                                    </ExternalLink>
                                                </React.Fragment>
                                            );
                                        case 'SPAN_PROPS_TYPE':
                                            return (
                                                <React.Fragment key={index}>
                                                    <span className="leading-8">{props.title}</span>
                                                </React.Fragment>
                                            );
                                        default: return null;
                                    }
                                })
                            }
                        </p>
                    </div>
                    <div className="space-y-4">
                        <AccountsSkeleton />
                        <button type="button" onClick={props.create.onSelect} className="w-full button-prime button-xs flex items-center justify-center space-x-2">
                            {props.create.icon && (<Icon type={props.create.icon} className="w-5 h-5"/>)}
                            <span className="">{props.create.title}</span>
                        </button>
                    </div>
                </div>
            );
        case AccountsViewType.DATA:
            return (
                <div className="space-y-12">
                    <Header
                        title={props.title}
                        right={
                            <div className="flex items-center justify-end space-x-2">
                                <button type="button" onClick={props.create.onSelect}
                                        className="button-prime button-xs">
                                    {props.create.icon && <Icon type={props.create.icon} className="w-5 h-5"/>}
                                    <span className="sr-only">{props.create.title}</span>
                                </button>
                            </div>
                        }
                    />
                    <Accounts accounts={props.accounts}/>
                </div>
            );
    }
};
