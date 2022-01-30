import React from 'react';
import { EntriesBookEntriesViewProps } from '../props';
import { Header } from '../../../components/header';
import { Select, OptionsType } from '../../../components/select';
import { Icon } from '../../../components/icons';
import { BookEntryMonthView } from './bookEntryMonthView';

export const EntriesBookEntriesView: React.FC<EntriesBookEntriesViewProps> = (props) => (
	<div className="space-y-12 pb-[100px]">
		<Header
			left={
				<div className="flex items-center justify-start">
					<Select {...props.template} optionsType={OptionsType.BL} />
				</div>
			}
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
		<div className="flex items-center space-x-2">
			{props.accounts.map((accountProps, index) => (
				<React.Fragment key={index}>
					<div className="min-w-[12rem] bg-blue-200 dark:bg-blue-900 p-4 rounded-md space-y-2 text-blue-600 dark:text-blue-200">
						<p className="text-xl font-medium">{accountProps.title}</p>
						<p className="dark:text-blue-400">{accountProps.number}</p>
						<div className="flex justify-end">
							{accountProps.value > 0 ? (
								<p className="text-green-600 text-xl font-medium">{accountProps.value}</p>
							) : (
								<p className="text-red-700 text-xl font-medium">{accountProps.value}</p>
							)}
						</div>
					</div>
				</React.Fragment>
			))}
		</div>
		<div className="space-y-4">
			{props.entries.map((bookEntryMonthViewProps, index) => (
				<React.Fragment key={index}>
					<BookEntryMonthView {...bookEntryMonthViewProps} />
				</React.Fragment>
			))}
		</div>
	</div>
);
