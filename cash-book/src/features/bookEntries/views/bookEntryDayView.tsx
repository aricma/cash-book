import React from 'react';
import { BookEntryDayViewProps, DataBookEntryViewProps, ErrorBookEnrtyViewProps } from '../props';
import { IconType } from '../../../models/props';
import { Disclosure } from '@headlessui/react';
import { Icon } from '../../../components/icons';
import { CurrencyInt } from '../../../models/currencyInt';

export const BookEntryDayView: React.FC<BookEntryDayViewProps> = (props) => {
	const cashInformation: Array<[title: string, value: string, icon?: IconType]> = [
		['Start', props.cashInfo.start],
		['In', props.cashInfo.add, IconType.TRENDING_UP_FILL],
		['Out', props.cashInfo.subtract, IconType.TRENDING_DOWN_FILL],
		['End', props.cashInfo.end],
		[
			'Diff',
			props.cashInfo.diff,
			CurrencyInt.fromStringOr(props.cashInfo.diff, 0) >= 0 ? IconType.TRENDING_UP_FILL : IconType.TRENDING_DOWN_FILL,
		],
	];
	return (
		<Disclosure>
			{({ open }) => (
				<>
					<div className="w-full block button button-xs flex items-center space-x-2">
						<Disclosure.Button className="flex-grow flex items-center justify-between space-x-2">
							<p className="font-medium">{props.date}</p>
							<Icon type={open ? IconType.CHEVRON_DOWN_FILL : IconType.CHEVRON_LEFT_FILL} className="w-5 h-5" />
						</Disclosure.Button>
						<button type="button" onClick={props.edit.onSelect} className="">
							{props.edit.icon && <Icon type={props.edit.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.edit.title}</span>
						</button>
						<button type="button" onClick={props.export.onSelect} className="">
							{props.export.icon && <Icon type={props.export.icon} className="w-5 h-5" />}
							<span className="sr-only">{props.export.title}</span>
						</button>
					</div>
					<Disclosure.Panel className="space-y-4">
						<p className="ml-2 text-blue-900 dark:text-blue-300 font-medium">Cash Station information</p>
						<div className="grid grid-cols-5 gap-2">
							{cashInformation.map((props, index) => (
								<React.Fragment key={index}>
									<div className="bg-blue-200 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300 p-2">
										<div className="space-y-2">
											<p className="font-medium text-left">{props[0]}</p>
											<div className="flex items-center justify-between space-x-2">
												{props[2] ? (
													props[2] === IconType.TRENDING_UP_FILL ? (
														<Icon type={IconType.TRENDING_UP_FILL} className="shrink-0 w-5 h-5 text-green-600" />
													) : (
														<Icon type={IconType.TRENDING_DOWN_FILL} className="shrink-0 w-5 h-5 text-red-600" />
													)
												) : (
													<div />
												)}
												<p className="place-self-center text-sm text-right">{props[1]}</p>
											</div>
										</div>
									</div>
								</React.Fragment>
							))}
						</div>
						<p className="ml-2 text-blue-900 dark:text-blue-300 font-medium">Transactions</p>
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
						{props.direction === IconType.ARROW_NARROW_LEFT_STROKE ? (
							<Icon type={props.direction} className="mx-2 w-6 h-6 text-green-500" />
						) : (
							<Icon type={props.direction} className="mx-2 w-6 h-6 text-red-500" />
						)}
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
