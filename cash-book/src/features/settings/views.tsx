import React from 'react';
import { ButtonProps } from '../../models/props';
import { SettingsViewProps } from './props';
import { Icon } from '../../components/icons';
import { Header } from '../menu';
import { FileInput } from '../../components/fileInput';

export const SettingsView: React.FC<SettingsViewProps> = (props) => (
	<div>
		<Header title={props.title} />
		<div className="flex items-center justify-center space-x-2">
			<ButtonPrime {...props.backup} />
			<FileInput
				{...props.loadBackup.input}
				onChange={(file) => {
					props.loadBackup.input.onChange(file);
				}}
				accept=".json"
				button={({ onSelect }) => <ButtonPrime {...props.loadBackup.button} onSelect={onSelect} />}
			/>
			<ButtonPrime {...props.reset} />
		</div>
	</div>
);

export const ButtonPrime: React.FC<ButtonProps> = (props) => (
	<button
		type="button"
		onClick={props.onSelect}
		className="button-prime button-md flex flex-col items-center justify-center space-y-2"
	>
		{props.icon && <Icon type={props.icon} className="w-6 h-6" />}
		<span className="">{props.title}</span>
	</button>
);
