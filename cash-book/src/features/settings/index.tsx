import React from 'react';
import {SettingsView} from './views';
import {toSettingsViewProps} from './toProps';


export const Settings: React.FC = () => {
	const viewProps = toSettingsViewProps();
	return <SettingsView {...viewProps} />;
};
