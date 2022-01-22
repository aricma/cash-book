import React from 'react';
import { CreateAccountViewProps, AccountsViewProps } from './props';
import { HeaderCellProps, BodyCellProps, DisabledButtonProps, ButtonProps } from '../../models/props';
import { Icon } from '../../components/icons';
import { TableCell } from '../../components/tableCell';
import { Select } from '../../components/select';
import { TextInput } from '../../components/textInput';
import { Header } from '../menu';
import { ImportAccounts } from '../importAccounts';

export const AccountsView: React.FC<AccountsViewProps> = (props) => (
	<div className="space-y-12">
		<Header
			title={props.title}
			right={() => (
				<div className="flex items-center justify-end space-x-2">
					<button type="button" onClick={props.create.onSelect} className="button-prime button-xs">
						{props.create.icon && <Icon type={props.create.icon} className="w-5 h-5" />}
						<span className="sr-only">{props.create.title}</span>
					</button>
					<ImportAccounts />
					<button type="button" onClick={props.export.onSelect} className="button-prime button-xs">
						{props.export.icon && <Icon type={props.export.icon} className="w-5 h-5" />}
						<span className="sr-only">{props.export.title}</span>
					</button>
				</div>
			)}
		/>
		<AccountsTableView accounts={props.accounts} />
	</div>
);

export const AccountsTableView: React.FC<{
	accounts: Array<Array<HeaderCellProps | BodyCellProps | ButtonProps | DisabledButtonProps>>;
}> = (props) => (
	<div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2">
		{props.accounts.slice(0, 1).map((row) => {
			return row.map((cell, index) => {
				return (
					<React.Fragment key={index}>
						<TableCell {...cell} />
					</React.Fragment>
				);
			});
		})}
		{props.accounts.slice(1).map((row, index) => {
			return (
				<React.Fragment key={index}>
					{index !== 0 && <div className="col-span-4 border-b border-gray-300 dark:border-gray-600" />}
					{row.map((cell, index) => {
						return (
							<React.Fragment key={index}>
								{index === 3 || index === 2 ? (
									<div className="flex items-center justify-end">
										<TableCell {...cell} />
									</div>
								) : index > 2 ? (
									<div className="place-self-center">
										<TableCell {...cell} />
									</div>
								) : (
									<div className="flex items-center">
										<TableCell {...cell} />
									</div>
								)}
							</React.Fragment>
						);
					})}
				</React.Fragment>
			);
		})}
	</div>
);

export const CreateAccountView: React.FC<CreateAccountViewProps> = (props) => (
	<div className="p-4 space-y-4">
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
		<div className="flex items-start space-x-2">
			<div>
				<Select {...props.type} />
				{props.type.validation && <span className="ml-2 text-sm text-danger">{props.type.validation}</span>}
			</div>
			<div>
				<TextInput {...props.name} />
			</div>
			<div>
				<TextInput {...props.number} pattern="\d*" />
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
				<button type="button" disabled className="button button-md">
					{props.submit.title}
				</button>
			)}
		</div>
	</div>
);
