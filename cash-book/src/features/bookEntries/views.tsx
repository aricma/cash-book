import React from 'react';
import {
	BookEntriesViewProps,
	BookEntryDayViewProps,
	ErrorBookEnrtyViewProps,
	DataBookEntryViewProps,
	BookEntryMonthViewProps,
} from './props';
import {IconType} from '../../models/props';
import {Icon} from '../../components/icons';
import {Disclosure} from '@headlessui/react';
import {Header} from '../menu';
import {Select} from '../../components/select';


export const BookEntriesView: React.FC<BookEntriesViewProps> = (props) => (
	<div className="space-y-12 pb-[100px]">
		<Header title={props.title}>
			<div className="flex items-center justify-end">
				<button type="button" onClick={props.create.onSelect} className="button-prime button-xs">
					{props.create.icon && <Icon type={props.create.icon} className="w-5 h-5" />}
					<span className="sr-only">{props.create.title}</span>
				</button>
			</div>
		</Header>
		<Select {...props.template} />
		<div className="flex items-center space-x-2">
			{props.accounts.map((accountProps, index) => (
				<React.Fragment key={index}>
					<div className="bg-blue-200 dark:bg-blue-900 p-4 rounded-md space-y-2 text-blue-600 dark:text-blue-200">
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

export const BookEntryMonthView: React.FC<BookEntryMonthViewProps> = (props) => {
	return (
		<div>
			<div className="w-full block text-1 button-xs flex items-center justify-between space-x-2">
				<p className="font-medium text-xl">{props.date}</p>
				<button type="button" onClick={props.export.onSelect} className="">
					{props.export.icon && <Icon type={props.export.icon} className="w-5 h-5" />}
					<span className="sr-only">{props.export.title}</span>
				</button>
			</div>
			<div className="space-y-4">
				{props.entries.map((bookEntryMonthViewProps, index) => (
					<React.Fragment key={index}>
						<BookEntryDayView {...bookEntryMonthViewProps} />
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export const BookEntryDayView: React.FC<BookEntryDayViewProps> = (props) => {
	return (
		<Disclosure>
			{({ open }) => (
				<>
					<div className="w-full block button button-xs flex items-center space-x-2">
						<Disclosure.Button className="flex-grow flex items-center justify-between space-x-2">
							<p className="font-medium">{props.date}</p>
							<Icon type={open ? IconType.CHEVRON_DOWN_FILL : IconType.CHEVRON_LEFT_FILL} className="w-5 h-5" />
						</Disclosure.Button>
						<button type="button" onClick={props.export.onSelect} className="">
							{props.export.icon && <Icon type={props.export.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.export.title}</span>
						</button>
					</div>
					<Disclosure.Panel>
						<div className="w-full px-2 text-2 grid grid-cols-[repeat(5,_minmax(min-content,_1fr))] gap-2">
							{props.entries.map((bookingProps, index) => {
								return (
									<React.Fragment key={index}>
										{index !== 0 && <div className="col-span-5 border-b border-gray-300 dark:border-gray-600" />}
										<BookEntry {...bookingProps} />
									</React.Fragment>
								);
							})}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export const BookEntry: React.FC<DataBookEntryViewProps | ErrorBookEnrtyViewProps> = (props) => {
	switch (props.type) {
		case 'DATA_BOOKING_VIEW_PROPS':
			return (
				<>
					<div className="flex items-center">
						<span className="text-ellipsis">{props.title}</span>
					</div>
					<div className="bg-blue-200 dark:bg-blue-900 py-1 px-2 rounded-md flex items-center justify-center">
						<span className="text-blue-500 dark:text-blue-300">{props.cashierAccount}</span>
					</div>
					<div className="place-self-center">
						{
							props.direction === IconType.ARROW_NARROW_LEFT_STROKE ? (
								<Icon type={props.direction} className="mx-2 w-6 h-6 text-green-500" />
							) : (
								<Icon type={props.direction} className="mx-2 w-6 h-6 text-red-500" />
							)
						}
					</div>
					<div className="bg-blue-200 dark:bg-blue-900 py-1 px-2 rounded-md flex items-center justify-center">
						<span className="text-blue-500 dark:text-blue-300">{props.otherAccount}</span>
					</div>
					<div className="flex items-center justify-end">
						<span className="text-1">{props.value}</span>
					</div>
				</>
			);
		case 'ERROR_BOOKING_VIEW_PROPS':
			return (
				<div className="">
					<div>{props.message}</div>
				</div>
			);
	}
};
