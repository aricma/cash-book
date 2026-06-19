import { LinkProps, WithClasses } from '../models/props';
import React from 'react';
import { WithChildren } from '../models/props';

export const ExternalLink: React.FC<LinkProps & WithClasses & WithChildren> = (props) => (
	<a href={props.link} title={props.title} target="_blank" rel="noreferrer" className={props.className}>
		{props.children}
	</a>
);
