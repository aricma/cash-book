import React from 'react';
import { NoTemplateBookEntriesViewProps, NoTemplatesBookEntriesViewProps } from '../props';
import { Header } from '../../../components/header';

export const EmptyBookEntriesView: React.FC<NoTemplateBookEntriesViewProps | NoTemplatesBookEntriesViewProps> = (
	props
) => (
	<div className="space-y-12 pb-[100px]">
		<Header title={props.title} />
	</div>
);
