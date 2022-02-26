import React from 'react';
import { CreateTemplateViewProps } from '../props/createTemplateViewProps';
import { Header } from '../../../components/header';
import { Icon } from '../../../components/icons';
import { TextInput } from '../../../components/textInput';
import { Select } from '../../../components/select';
import { CreateTransactionView } from './createTransactionView';

export const CreateTemplateView: React.FC<CreateTemplateViewProps> = (props) => (
	<div className="h-full flex flex-col">
		<div className="flex-shrink-0 p-4">
			<Header
				title={props.title}
				right={() => (
					<div className="flex items-center justify-end">
						<button type="button" onClick={props.close.onSelect} className="link link-sm">
							{props.close.icon && <Icon type={props.close.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.close.title}</span>
						</button>
					</div>
				)}
			/>
		</div>
		<div id="create-template-modal-content" className="flex-grow pb-[250px] space-y-8 overflow-auto p-4">
			<div className="space-y-2">
				<TextInput autoFocus {...props.name} />
				<Select {...props.cashierAccount} />
				<Select {...props.diffAccount} />
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between space-x-2">
					<h3 className="text-lg text-2">Transactions</h3>
					{props.addTransaction && (
						<button type="button" onClick={props.addTransaction.onSelect} className="button-prime button-xs">
							{props.addTransaction.icon && <Icon type={props.addTransaction.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.addTransaction.title}</span>
						</button>
					)}
				</div>
				<div className="grid grid-cols-[max-content_1fr] gap-2">
					{props.transactions &&
						props.transactions.map((transactionConfig, index) => (
							<React.Fragment key={index}>
								<div className="flex items-center justify-end">
									<span className="text-2">{transactionConfig.order}</span>
								</div>
								<CreateTransactionView {...transactionConfig} />
							</React.Fragment>
						))}
				</div>
				<div className="flex items-center justify-end">
					{props.transactions && props.transactions?.length > 0 && props.addTransaction && (
						<button type="button" onClick={props.addTransaction.onSelect} className="button-prime button-xs">
							{props.addTransaction.icon && <Icon type={props.addTransaction.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.addTransaction.title}</span>
						</button>
					)}
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2">
				<button type="button" onClick={props.cancel.onSelect} className="button button-md">
					{props.cancel.title}
				</button>
				{props.submit.type === 'BUTTON_PROPS_TYPE' ? (
					<button type="button" onClick={props.submit.onSelect} className="button-prime button-md">
						{props.submit.title}
					</button>
				) : (
					<button type="button" disabled className="button-disabled button-md">
						{props.submit.title}
					</button>
				)}
			</div>
		</div>
	</div>
);
