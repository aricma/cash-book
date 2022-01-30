import React from 'react';
import { SkeletonTransactionsViewProps } from '../props/transactionsViewProps';
import { Header } from '../../../components/header';
import { Icon } from '../../../components/icons';
import { ExternalLink } from '../../../components/externalLink';

export const SkeletonTransactionsView: React.FC<SkeletonTransactionsViewProps> = (props) => {
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
			<div className="space-y-4">
				<TemplatesSkeleton />
			</div>
		</div>
	);
};

export const TemplatesSkeleton: React.FC = () => (
	<>
		{Array(3)
			.fill(null)
			.map((_, index) => {
				return (
					<React.Fragment key={index}>
						<div className="bg-blue-100 dark:bg-blue-900 rounded-md py-2 pl-4 pr-2">
							<div className="grid grid-cols-[2fr_1fr_max-content] grid-rows-[max-content_max-content] gap-y-2 gap-x-4">
								{/*<div className="min-w-[3rem] bg-blue-200 rounded-md" />*/}
								{/*<div className="min-w-[3rem] bg-blue-200 rounded-md" />*/}
								{/*<div className="place-self-center">*/}
								{/*    <button type="button" disabled className="bg-blue-200 text-white button-xs pt-[.35rem] pr-[.35rem]">*/}
								{/*        <Icon type={IconType.PENCIL_ALT_FILL} className="w-5" />*/}
								{/*    </button>*/}
								{/*</div>*/}
							</div>
						</div>
					</React.Fragment>
				);
			})}
	</>
);
