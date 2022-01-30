import React from 'react';
import { TemplateViewProps } from '../props/transactionsViewProps';
import { Icon } from '../../../components/icons';
import { Target } from '../dndDraggable';
import { TransactionView } from './transactionView';

export const TemplateView: React.FC<TemplateViewProps> = (props) => {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between space-x-2">
				<p className="text-2 text-lg font-medium">{props.title}</p>
				<button type="button" onClick={props.edit.onSelect} className="button-prime button-xs">
					{props.edit.icon && <Icon type={props.edit.icon} className="w-5 h-5" />}
					<span className="sr-only">{props.edit.title}</span>
				</button>
			</div>
			<div className="grid grid-cols-[max-content_1fr] gap-2">
				{props.transactions.map((transactionsViewProps, index) => (
					<React.Fragment key={transactionsViewProps.title}>
						<div className="flex items-center justify-end">
							<span className="text-2">{transactionsViewProps.order}</span>
						</div>
						<Target index={index} move={transactionsViewProps.move}>
							<TransactionView {...transactionsViewProps} />
						</Target>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
