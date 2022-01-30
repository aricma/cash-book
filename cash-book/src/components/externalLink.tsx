import { LinkProps, WithClasses } from '../models/props';
import React from 'react';

export const ExternalLink: React.FC<LinkProps & WithClasses> = (props) => (
	<a href={props.link} title={props.title} target="_blank" rel="noreferrer" className={props.className}>
		{props.children}
	</a>
);
