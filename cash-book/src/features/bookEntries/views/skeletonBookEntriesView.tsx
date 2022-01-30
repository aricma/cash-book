import React from 'react';
import { SkeletonBookEntriesViewProps } from '../props';
import { Header } from '../../../components/header';
import { Select, OptionsType } from '../../../components/select';
import { Icon } from '../../../components/icons';
import { ExternalLink } from '../../../components/externalLink';

export const SkeletonBookEntriesView: React.FC<SkeletonBookEntriesViewProps> = (props) => (
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
		<div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md p-4 space-y-2">
			<h3 className="text-lg font-medium dark:text-blue-300">{props.infoBox.title}</h3>
			<p className="">
				{props.infoBox.message.map((props, index) => {
					switch (props.type) {
						case 'BUTTON_PROPS_TYPE':
							return (
								<React.Fragment key={index}>
									<button
										type="button"
										onClick={props.onSelect}
										className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2"
									>
										{props.icon && <Icon type={props.icon} className="w-4 h-4" />}
										<span className="leading-5">{props.title}</span>
									</button>
								</React.Fragment>
							);
						case 'LINK_PROPS_TYPE':
							return (
								<React.Fragment key={index}>
									<ExternalLink
										{...props}
										className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2"
									>
										{props.icon && <Icon type={props.icon} className="w-4 h-4" />}
										<span className="leading-5">{props.title}</span>
									</ExternalLink>
								</React.Fragment>
							);
						case 'SPAN_PROPS_TYPE':
							return (
								<React.Fragment key={index}>
									<span className="leading-8">{props.title}</span>
								</React.Fragment>
							);
						default:
							return null;
					}
				})}
			</p>
		</div>
		<div className="space-y-8">
			<EntriesSkeleton n={3} />
			<EntriesSkeleton n={2} />
		</div>
	</div>
);

const EntriesSkeleton: React.FC<{ n: number }> = (props) => (
	<div className="space-y-2">
		<div className="bg-blue-50 dark:bg-blue-900/25 px-4 py-2 rounded-md grid grid-cols-[1fr_2fr_max-content_max-content] gap-2">
			<div className="h-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
			<div className="col-start-4 h-8 w-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
		</div>
		{Array(props.n)
			.fill(null)
			.map(() => (
				<TransactionSkeleton />
			))}
	</div>
);

const TransactionSkeleton = () => (
	<div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-md grid grid-cols-[2fr_1fr_max-content_max-content] gap-2">
		<div className="h-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
		<div className="h-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
		<div className="h-8 w-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
		<div className="h-8 w-8 bg-blue-200 dark:bg-blue-900 rounded-md" />
	</div>
);
