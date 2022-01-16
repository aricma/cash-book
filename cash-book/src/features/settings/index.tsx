import React from 'react';
import { Icon } from '../../components/icons';
import { Header } from '../menu';
import { ButtonProps, IconType, FileInputProps } from '../../models/props';
import { dispatch } from '../../applicationState';
import { ApplicationActionType } from '../../applicationState/actions';
import { FileInput } from '../../components/fileInput';

export const Settings: React.FC = () => {
	const viewProps: SettingsViewProps = {
		title: 'Settings',
		backup: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.DOWNLOAD_FILL,
			title: 'Backup',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.APPLICATION_BACKUP,
				});
			},
		},
		reset: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CLOSE_FILL,
			title: 'Reset',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.APPLICATION_RESET,
				});
			},
		},
		loadBackup: {
			button: {
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.UPLOAD_FILL,
				title: 'Load From Backup',
				onSelect: () => {},
			},
			input: {
				type: 'FILE_INPUT_PROPS_TYPE',
				value: undefined,
				placeholder: '',
				onChange: (file) => {
					dispatch({
						type: ApplicationActionType.APPLICATION_BACKUP_LOAD,
						file: file,
					});
				},
			},
		},
	};
	return <SettingsView {...viewProps} />;
};

interface SettingsViewProps {
	title: string;
	reset: ButtonProps;
	backup: ButtonProps;
	loadBackup: {
		button: ButtonProps;
		input: FileInputProps;
	};
}

export const SettingsView: React.FC<SettingsViewProps> = (props) => (
	<div>
		<Header title={props.title} />
		<div className="flex items-center justify-center space-x-2">
			<ButtonPrime {...props.backup} />
			<FileInput
				{...props.loadBackup.input}
				onChange={(file) => {
					console.log('ONCHANGE', file);
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
