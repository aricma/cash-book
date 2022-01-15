import React from 'react';
import { WithClasses } from '../../models/props';

export const Spinner: React.FC<WithClasses> = (props) => (
	<svg className={['spinner', props.className || ''].join(' ')} stroke="currentColor" viewBox="0 0 50 50">
		<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
	</svg>
);
