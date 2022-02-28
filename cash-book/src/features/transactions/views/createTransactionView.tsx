import React from 'react';
import { CreateTransactionViewProps } from '../props/createTemplateViewProps';
import { TextInput } from '../../../components/textInput';
import { Icon } from '../../../components/icons';
import { Select } from '../../../components/select';
import { Button } from './button';

export const CreateTransactionView: React.FC<CreateTransactionViewProps> = (props) => (
	<div className="p-4 rounded-xl border-4 border-blue-200 dark:border-blue-900 flex space-x-2">
		<div className="flex-grow space-y-2">
			<TextInput autoFocus {...props.name} />
			<div className="flex items-end space-x-2">
				<div className="">
					<div className="button-still button-md">{props.cashierAccount}</div>
				</div>
				<div className="flex-shrink-0">
					<button type="button" onClick={props.type.onSelect} className="button rounded-md p-2">
						{props.type.icon && <Icon type={props.type.icon} className="w-6 h-6" />}
						<span className="sr-only">{props.type.title}</span>
					</button>
				</div>
				<div data-test-id="create-transaction-select-other-account" className="flex-grow">
					<Select {...props.account} />
					{props.account.validation && <span className="ml-2 text-sm text-danger">{props.account.validation}</span>}
				</div>
			</div>
		</div>
		<div className="flex-shrink-0">
			<div className="h-full flex flex-col items-center justify-between">
				<button type="button" onClick={props.remove.onSelect} className="text-1 hover:text-blue-500">
					{props.remove.icon && <Icon type={props.remove.icon} className="w-5 h-5" />}
					<span className="sr-only">{props.remove.title}</span>
				</button>
				<div className="flex flex-col space-y-1">
					<Button {...props.decreaseOrder} />
					<Button {...props.increaseOrder} />
				</div>
			</div>
		</div>
	</div>
);
