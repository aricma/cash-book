import React from 'react';
import {AccountProps} from '../props/accountsViewProps';
import {Icon} from '../../../components/icons';
import {IconType} from '../../../models/props';


export const Accounts: React.FC<{ accounts: Array<AccountProps> }> = (props) => (
    <div className="space-y-2">
        {props.accounts.map((accountProps, index) => {
            return (
                <React.Fragment key={index}>
                    <div className="bg-blue-200 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-md shadow-md shadow-blue-600/30 dark:shadow-gray-900 py-2 pl-4 pr-2">
                        <div className="grid grid-cols-[max-content_1fr_max-content] grid-rows-[max-content_max-content] gap-y-2 gap-x-4">
                            <div className="flex items-end justify-start">
                                <p className="place-self-left text-lg font-medium">{accountProps.title}</p>
                            </div>
                            <div className="flex items-end justify-end">
                                <div className="bg-blue-300 rounded-md py-1 px-2">
                                    {accountProps.number}
                                </div>
                            </div>
                            <div className="place-self-center">
                                <button type="button" onClick={accountProps.edit.onSelect} className="button-prime bg-blue-300 button-xs pt-[.35rem] pr-[.35rem]">
                                    {accountProps.edit.icon && (<Icon type={accountProps.edit.icon} className="w-5" />)}
                                    <span className="sr-only">{accountProps.edit.title}</span>
                                </button>
                            </div>
                            {
                                accountProps.type && (
                                    <div className="flex items-end justify-start">
                                        <p className="place-self-left text-orange-500 italic">{accountProps.type}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </React.Fragment>
            );
        })}
    </div>
);

export const AccountsSkeleton: React.FC = () => (
    <>
        {Array(3).fill(null).map((_, index) => {
            return (
                <React.Fragment key={index}>
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-md py-2 pl-4 pr-2 cursor-not-allowed">
                        <div className="grid grid-cols-[2fr_1fr_max-content] grid-rows-[max-content_max-content] gap-y-2 gap-x-4">
                            <div className="min-w-[3rem] bg-blue-200 rounded-md" />
                            <div className="min-w-[3rem] bg-blue-200 rounded-md" />
                            <div className="place-self-center">
                                <button type="button" disabled className="button-disabled bg-blue-200 text-white button-xs pt-[.35rem] pr-[.35rem]">
                                    <Icon type={IconType.PENCIL_ALT_FILL} className="w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        })}
    </>
);
