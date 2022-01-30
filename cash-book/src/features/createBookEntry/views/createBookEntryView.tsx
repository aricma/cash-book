import React from 'react';
import {CreateBookEntryViewProps, CreateBookEntryViewType} from '../props';
import {Select, OptionsType} from '../../../components/select';
import {Header} from '../../../components/header';
import {TemplateConfigView} from './templateConfigView';
import {Icon} from '../../../components/icons';
import {IconType} from '../../../models/props';
import {ExternalLink} from '../../../components/externalLink';


export const CreateBookEntryView: React.FC<CreateBookEntryViewProps> = (props) => {
	switch (props.type) {
		case CreateBookEntryViewType.NO_TEMPLATES:
			return (
				<form className="w-full pb-[100px] space-y-4">
					<Header title={props.title} />
					<div className="bg-orange-100 text-orange-600 rounded-md p-4 space-y-2">
						<h3 className="text-lg font-medium flex space-x-2">
							<Icon type={IconType.EXCLAMATION_STROKE} className="w-6"/>
							<span>{props.warningBox.title}</span>
						</h3>
						<p className="">
							{
								props.warningBox.message.map((props, index) => {
									switch (props.type) {
										case 'BUTTON_PROPS_TYPE':
											return (
												<React.Fragment key={index}>
													<button type="button" onClick={props.onSelect}
															className="button-prime bg-orange-600 hover:bg-orange-500 focus:ring-orange-600 button-xs py-1 inline-flex items-center justify-center space-x-2">
														{props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
														<span className="leading-5">{props.title}</span>
													</button>
												</React.Fragment>
											);
										// case 'DISABLED_BUTTON_PROPS_TYPE':
										case 'LINK_PROPS_TYPE':
											return (
												<React.Fragment key={index}>
													<ExternalLink {...props}
																  className="button-prime bg-orange-600 hover:bg-orange-500 focus:ring-orange-600 button-xs py-1 inline-flex items-center justify-center space-x-2">
														{props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
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
								})
							}
						</p>
					</div>
				</form>
			);
		case CreateBookEntryViewType.FORM_NO_TEMPLATE:
			return (
				<form className="w-full pb-[100px] space-y-4">
					<Header
						title={props.title}
						left={
							<div className="flex items-center justify-start">
								<Select {...props.template} optionsType={OptionsType.BL} />
							</div>
						}
					/>
					<div className="bg-blue-100 text-blue-600 rounded-md p-4 space-y-2">
						<h3 className="text-lg font-medium">{props.infoBox.title}</h3>
						<p className="">
							{
								props.infoBox.message.map((props, index) => {
									switch (props.type) {
										case 'OPTIONS_INPUT_PROPS_TYPE':
											return (
												<React.Fragment key={index}>
													<Select {...props} optionsType={OptionsType.BL} />
												</React.Fragment>
											)
										case 'BUTTON_PROPS_TYPE':
											return (
												<React.Fragment key={index}>
													<button type="button" onClick={props.onSelect}
															className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2">
														{props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
														<span className="leading-5">{props.title}</span>
													</button>
												</React.Fragment>
											);
										case 'LINK_PROPS_TYPE':
											return (
												<React.Fragment key={index}>
													<ExternalLink {...props}
																  className="button-prime button-xs py-1 inline-flex items-center justify-center space-x-2">
														{props.icon && (<Icon type={props.icon} className="w-4 h-4"/>)}
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
								})
							}
						</p>
					</div>
				</form>
			);
		case CreateBookEntryViewType.FORM_DEFAULT:
			return (
				<form className="w-full pb-[100px] space-y-4">
					<Header
						title={props.title}
						left={
							<div className="flex items-center justify-start">
								<Select {...props.template} optionsType={OptionsType.BL} />
							</div>
						}
					/>
					<TemplateConfigView {...props.templateConfig} />
				</form>
			);
		default: return null;
	}
};
