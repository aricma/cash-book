import { Dispatch } from '../../applicationState';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';
import { ErrorViewProps } from './props';
import { ButtonProps, IconType } from '../../models/props';
import { ApplicationActionType, ExportPayloadType, ExportFileType } from '../../applicationState/actions';
import { DOCS_SUPPORT } from '../../variables/externalLinks';

export const makeToErrorViewProps =
	(dispatch: Dispatch) =>
	(error: CashBookError): ErrorViewProps => {
		const resetButton: ButtonProps = {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.CLOSE_FILL,
			title: 'Reset',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.APPLICATION_RESET,
				});
			},
		};
		const backupButton: ButtonProps = {
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
		};
		const reloadButton: ButtonProps = {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.REFRESH_FILL,
			title: 'Reload',
			onSelect: () => {
				window.location.reload();
			},
		};
		const supportButton: ButtonProps = {
			type: 'BUTTON_PROPS_TYPE',
			icon: IconType.SUPPORT_FILL,
			title: 'Contact Support',
			onSelect: () => {
				dispatch({
					type: ApplicationActionType.ROUTER_GO_TO,
					path: DOCS_SUPPORT,
				});
			},
		};
		const buttons = [supportButton, resetButton, backupButton, reloadButton];
		switch (error.type) {
			case CashBookErrorType.FAILED_TO_LOAD_BACKUP:
				return {
					title: 'Failed To Load Backup',
					message:
						'There was an error loading the application state from your browsers local storage. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_EXPORT:
				return {
					title: 'Failed To Export',
					message: 'There was an error exporting. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_EXPORT_BACKUP:
				return {
					title: 'Failed To Export Backup',
					message: 'There was an error exporting the backup. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_RESET:
				return {
					title: 'Failed To Reset The Application',
					message: 'There was an error resetting the application. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_SAVE_BACKUP_TO_LOCAL_STORAGE:
				return {
					title: 'Failed To Save The Backup To The Browser Local Storage',
					message: 'There was an error saving the backup to the browser local storage. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_UPLOAD_BACKUP:
				return {
					title: 'Failed Uploading The Backup',
					message: 'There was an error while uploading the backup to the browser local storage. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.INVALID_BACKUP:
				return {
					title: 'Failed To Read/Validate The Backup',
					message:
						'There was an error while validating the backup. This could mean that referenced accounts, templates or transactions are missing or that any of the data is simply in a wrong format. This is a highly unusual scenario. You should make sure that this backup data was not modified manually by a third party. ' +
						STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			case CashBookErrorType.FAILED_TO_WRITE_TO_FILE:
				return {
					title: 'Failed To Write To File',
					message:
						'There was an error while writing data to a file. Maybe your browser is blocking the file export. ' +
						STANDARD_MESSAGE,
					buttons: [...buttons],
				};
			default:
				return {
					title: 'Unknown Error',
					message: 'There was an unknown error. ' + STANDARD_MESSAGE,
					buttons: [...buttons],
				};
		}
	};

const STANDARD_MESSAGE =
	'Try to "Reload" the the page to fetch any software updates. If you already reloaded the Page, then "Download Backup" and contact the CashBook support. If you no longer need the data from you current application state, then "Reset" start fresh.';
