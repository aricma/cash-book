import { IconType } from '../../models/props';
import { ApplicationActionType, ExportPayloadType, ExportFileType } from '../../applicationState/actions';
import { SettingsViewProps } from './props';
import { ROUTES_SUPPORT } from '../../variables/routes';
import { dispatch } from '../../applicationState/store';

export const toSettingsViewProps = (): SettingsViewProps => {
	return {
		title: 'Settings',
		support: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.SUPPORT_STROKE,
			title: 'Support',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.ROUTER_GO_TO,
					path: ROUTES_SUPPORT,
				});
			},
		},
		backup: {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.DOWNLOAD_FILL,
			title: 'Download Backup',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.ALL,
						fileType: ExportFileType.JSON,
					},
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
				title: 'Load Backup',
				onSelect: () => {},
			},
			input: {
				type: 'FILE_INPUT_PROPS_TYPE',
				value: undefined,
				placeholder: '',
				onChange: (file) => {
					dispatch({
						type: ApplicationActionType.APPLICATION_BACKUP_UPLOAD,
						file: file,
					});
				},
			},
		},
	};
};
