import React from 'react';
import { ButtonProps, DisabledButtonProps, WithClasses } from '../models/props';
import { Icon } from './icons';

export interface DatePickerProps {
	year: {
		prev: ButtonProps;
		current: ButtonProps;
		next: ButtonProps;
	};
	month: {
		prev: ButtonProps;
		current: string;
		next: ButtonProps;
	};
	weekdays: Array<string>;
	days: Array<ButtonProps | DisabledButtonProps>;
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
	return (
		<div className="space-y-2">
			<div className="grid grid-cols-3">
				<div className="justify-self-start px-2">
					<Button {...props.year.prev} className="button button-xs">
						{props.year.prev.icon && (
							<Icon type={props.year.prev.icon} className="w-5 h-5" />
						)}
						<span className="sr-only">{props.year.prev.title}</span>
					</Button>
				</div>
				<Button
					{...props.year.current}
					className="justify-self-center btn-2 btn-md text-2"
				>
					{props.year.current.title}
				</Button>
				<div className="justify-self-end px-2">
					<Button {...props.year.next} className="button button-xs">
						{props.year.next.icon && (
							<Icon type={props.year.next.icon} className="w-5 h-5" />
						)}
						<span className="sr-only">{props.year.next.title}</span>
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-3">
				<div className="justify-self-start px-2">
					<Button {...props.month.prev} className="button button-xs">
						{props.month.prev.icon && (
							<Icon type={props.month.prev.icon} className="w-5 h-5" />
						)}
						<span className="sr-only">{props.month.prev.title}</span>
					</Button>
				</div>
				<span className="justify-self-center text-2">
					{props.month.current}
				</span>
				<div className="justify-self-end px-2">
					<Button {...props.month.next} className="button button-xs">
						{props.month.next.icon && (
							<Icon type={props.month.next.icon} className="w-5 h-5" />
						)}
						<span className="sr-only">{props.month.next.title}</span>
					</Button>
				</div>
			</div>
			<ul className="grid grid-cols-7 gap-1">
				{props.weekdays.map((weekday, index) => {
					return (
						<span key={index} className="justify-self-center text-2">
							{weekday}
						</span>
					);
				})}
				<div className="col-span-7 border-b border-gray-400 dark:border-gray-600" />
				{props.days.map((buttonProps, index) => {
					switch (buttonProps.type) {
						case 'BUTTON_PROPS_TYPE':
							if (buttonProps.isSelected) {
								return (
									<div key={index} className="flex items-center justify-center">
										<Button
											{...buttonProps}
											className="w-8 h-8 rounded-md py-1 px-2 text-sm text-white dark:text-gray-100 bg-green-500 hover:text-white dark:hover:text-gray-100 hover:bg-green-600"
										>
											{buttonProps.title}
										</Button>
									</div>
								);
							} else {
								return (
									<div key={index} className="flex items-center justify-center">
										<Button
											{...buttonProps}
											className="w-8 h-8 rounded-md py-1 px-2 text-sm text-1 hover:text-white dark:hover:text-gray-100 hover:bg-green-500"
										>
											{buttonProps.title}
										</Button>
									</div>
								);
							}
						case 'DISABLED_BUTTON_PROPS_TYPE':
							return (
								<DisabledButton
									key={index}
									{...buttonProps}
									className="text-3 text-sm cursor-not-allowed"
								>
									{buttonProps.title}
								</DisabledButton>
							);
						default:
							return null;
					}
				})}
			</ul>
		</div>
	);
};

const Button: React.FC<ButtonProps & WithClasses> = (props) => (
	<button type="button" onClick={props.onSelect} className={props.className}>
		{props.children}
	</button>
);

const DisabledButton: React.FC<DisabledButtonProps & WithClasses> = (props) => (
	<button type="button" disabled className={props.className}>
		{props.children}
	</button>
);
