import React from 'react';
import { OptionsInputProps, IconType } from '../models/props';
import { Listbox } from '@headlessui/react';
import { Icon } from './icons';

export const Select: React.FC<OptionsInputProps> = (props) => {
	React.useEffect(() => {
		if (props.options.length === 1) {
			props.options.forEach((buttonProps) => {
				if (buttonProps.type === 'BUTTON_PROPS_TYPE') {
					buttonProps.onSelect();
				}
			});
		}
		// eslint-disable-next-line
	}, []);
	const changeHandler = (buttonPropsTitle: string) => {
		props.options.forEach((buttonProps) => {
			if (
				buttonProps.type === 'BUTTON_PROPS_TYPE' &&
				buttonPropsTitle === buttonProps.title
			) {
				buttonProps.onSelect();
			}
		});
	};
	return (
		<Listbox
			as="div"
			value={props.value}
			onChange={changeHandler}
			className="relative w-full"
		>
			<Listbox.Button className="button button-md">
				{props.value || props.placeholder}
			</Listbox.Button>
			<Listbox.Options className="origin-top-right absolute z-10 right-0 mt-2 w-full shadow-lg button button-md p-0">
				<div className="rounded-md bg-level divide-y-2 divide-gray-300 dark:divide-gray-900">
					{props.options.map((buttonProps, index) => (
						<Listbox.Option key={index} value={buttonProps.title}>
							{({ active, selected }) => {
								if (active) {
									return (
										<div className="cursor-pointer py-2 px-4 text-blue-500 flex items-center space-x-2">
											<Icon
												type={IconType.CHEVRON_RIGHT_FILL}
												className="w-3 h-3"
											/>
											<div className="">{buttonProps.title}</div>
										</div>
									);
								} else if (selected) {
									return (
										<div className="cursor-pointer py-2 px-4 text-blue-500">
											{buttonProps.title}
										</div>
									);
								} else {
									return (
										<div className="cursor-pointer py-2 px-4 text-2">
											{buttonProps.title}
										</div>
									);
								}
							}}
						</Listbox.Option>
					))}
				</div>
			</Listbox.Options>
		</Listbox>
	);
};
