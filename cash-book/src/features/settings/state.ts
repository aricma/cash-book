export enum SettingsSaveType {
	AUTO = 'Settings_Save_Type/AUTO',
	MANUAL = 'Settings_Save_Type/MANUAL',
}

export interface SettingsState {
	save: SettingsSaveType;
}

export const initialState: SettingsState = {
	save: SettingsSaveType.AUTO,
};
