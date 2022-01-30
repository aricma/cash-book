import React from 'react';
import { DataTransactionsViewProps } from '../props/transactionsViewProps';
import { Header } from '../../../components/header';
import { Icon } from '../../../components/icons';
import { TemplateView } from './templateView';

export const DataTransactionsView: React.FC<DataTransactionsViewProps> = (props) => {
	return (
		<div className="space-y-12 pb-[100px]">
			<Header
				title={props.title}
				right={
					<div className="flex items-center justify-end">
						<button type="button" onClick={props.create.onSelect} className="button-prime button-xs">
							{props.create.icon && <Icon type={props.create.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.create.title}</span>
						</button>
					</div>
				}
			/>
			<div className="space-y-8">
				{props.templates.map((templateViewProps, index) => (
					<React.Fragment key={index}>
						<TemplateView {...templateViewProps} />
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
