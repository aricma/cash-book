import React from 'react';
import { MenuViewProps } from '../props/menuViewProps';
import { Icon } from '../../../components/icons';
import { MenuButton } from './menuButton';

export const MenuView: React.FC<MenuViewProps> = (props) => (
	<div className="relative context w-screen h-full">
		<div className="absolute indent-0 w-[110%] h-full bg-blue-500 dark:bg-blue-900 blur-lg" />
		<div className="absolute z-10 bg-canvas w-full h-full">
			<div className="w-full max-w-2xl h-full mx-auto px-2 py-2 grid grid-flow-col auto-cols-fr content-center">
				{props.pages.slice(0, 5).map((buttonProps, index) => {
					if (buttonProps.isCenter) {
						return (
							<div key={index} className="flex items-center justify-center">
								<button
									type="button"
									onClick={buttonProps.onSelect}
									className="button-prime button-md p-4 rounded-full"
								>
									{buttonProps.icon && <Icon type={buttonProps.icon} className="w-6 h-6" />}
									<span className="sr-only">{buttonProps.title}</span>
								</button>
							</div>
						);
					} else {
						return (
							<div key={index} className="flex items-center justify-center">
								<MenuButton {...buttonProps} />
							</div>
						);
					}
				})}
			</div>
		</div>
	</div>
);
