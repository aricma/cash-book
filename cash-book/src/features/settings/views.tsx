import React from 'react';
import {ButtonProps} from '../../models/props';
import {SettingsViewProps} from './props';
import {Icon} from '../../components/icons';
import {FileInput} from '../../components/fileInput';
import {Header} from '../../components/header';


export const SettingsView: React.FC<SettingsViewProps> = (props) => (
    <div className="space-y-4">
        <Header
            title={props.title}
            right={
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={props.support.onSelect}
                        className="button-prime button-xs flex items-center justify-center space-x-2">
                        {props.support.icon && <Icon type={props.support.icon} className="w-6 h-6"/>}
                        <span className="">{props.support.title}</span>
                    </button>
                </div>
            }
        />
        <div className="grid grid-cols-[max-content_1fr] gap-2">
            <div className="flex items-center justify-start">
                <p className="text-2">{props.backup.title}</p>
            </div>
            <ButtonPrime {...props.backup} />
            <div className="flex items-center justify-start">
                <p className="text-2">{props.loadBackup.button.title}</p>
            </div>
            <FileInput
                {...props.loadBackup.input}
                onChange={(file) => {
                    props.loadBackup.input.onChange(file);
                }}
                accept=".json"
                button={({onSelect}) => <ButtonPrime {...props.loadBackup.button} onSelect={onSelect}/>}
            />
            <div className="flex items-center justify-start">
                <p className="text-2">{props.reset.title}</p>
            </div>
            <ButtonPrime {...props.reset} />
        </div>
    </div>
);

export const ButtonPrime: React.FC<ButtonProps> = (props) => (
    <button
        type="button"
        onClick={props.onSelect}
        className="button-prime button-sm flex items-center justify-between space-y-2"
    >
        {props.icon && <Icon type={props.icon} className="w-6 h-6"/>}
        <span className="">{props.title}</span>
    </button>
);
