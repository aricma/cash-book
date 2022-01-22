import React from 'react';
import { useMatch } from 'react-router-dom';
import { ApplicationActionType } from '../../applicationState/actions';
import { ButtonProps, IconType } from '../../models/props';
import { Icon } from '../../components/icons';
import { dispatch } from '../../applicationState';
import {
	ROUTES_ACCOUNTS,
	ROUTES_CREATE_BOOK_ENTRY,
	ROUTES_TRANSACTIONS,
	ROUTES_BOOK_ENTRIES,
	ROUTES_SETTINGS,
} from '../../variables/routes';

export interface Props {
	left?: React.FC;
	title: string;
	right?: React.FC;
}
export const Header: React.FC<Props> = (props) => {
	return (
		<div className="grid grid-cols-[1fr_max-content_1fr] gap-2">
			{props.left ? (<div><props.left /></div>) : (<div />)}
			<h2 className="text-lg font-medium text-2 place-self-center">{props.title}</h2>
			{props.right ? (<div><props.right /></div>) : (<div />)}
		</div>
	);
};

export const Menu: React.FC = () => {
	const matchAccountsRoute = useMatch(ROUTES_ACCOUNTS);
	const matchTransactionsRoute = useMatch(ROUTES_TRANSACTIONS);
	const matchCreateBookEntryRoute = useMatch(ROUTES_CREATE_BOOK_ENTRY);
	const matchBookEntriesRoute = useMatch(ROUTES_BOOK_ENTRIES);
	const viewProps: MenuViewProps = {
		pages: [
			{
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.COLLECTION_FILL,
				title: 'Accounts',
				isSelected: matchAccountsRoute !== null,
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_ACCOUNTS,
					});
				},
			},
			{
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.CLIPBOARD_CHECK_FILL,
				title: 'Transactions',
				isSelected: matchTransactionsRoute !== null,
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_TRANSACTIONS,
					});
				},
			},
			{
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.PLUS_FILL,
				title: 'Create Book Entry',
				isSelected: matchCreateBookEntryRoute !== null,
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_CREATE_BOOK_ENTRY,
					});
				},
			},
			{
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.BOOK_OPEN_FILL,
				title: 'Entries',
				isSelected: matchBookEntriesRoute !== null,
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_BOOK_ENTRIES,
					});
				},
			},
			{
				type: 'BUTTON_PROPS_TYPE',
				icon: IconType.COG_FILL,
				title: 'Settings',
				onSelect: () => {
					dispatch({
						type: ApplicationActionType.ROUTER_GO_TO,
						path: ROUTES_SETTINGS,
					});
				},
			},
		],
	};
	return <MenuView {...viewProps} />;
};

export interface MenuViewProps {
	pages: Array<ButtonProps>;
}

export const MenuView: React.FC<MenuViewProps> = (props) => (
	<div className="relative context w-screen h-full">
		<div className="absolute indent-0 w-[110%] h-full bg-blue-500 dark:bg-blue-900 blur-lg" />
		<div className="absolute z-10 bg-canvas w-full h-full px-2 py-2 grid grid-cols-[1fr_1fr_max-content_1fr_1fr] gap-2">
			{props.pages.slice(0, 5).map((buttonProps, index) => {
				if (index === 2) {
					return (
						<div key={index} className="flex items-center justify-center">
							<button type="button" onClick={buttonProps.onSelect} className="button-prime button-md p-4 rounded-full">
								{buttonProps.icon && <Icon type={buttonProps.icon} className="w-6 h-6" />}
								<span className="sr-only">{buttonProps.title}</span>
							</button>
						</div>
					);
				} else {
					return <MenuButton key={index} {...buttonProps} />;
				}
			})}
		</div>
	</div>
);

const MenuButton: React.FC<ButtonProps> = (props) => {
	if (props.isSelected) {
		return (
			<button type="button" onClick={props.onSelect} className="rounded-md text-blue-600 hover:focus:text-blue-700">
				<div className="flex flex-col items-center justify-center space-y-1">
					{props.icon && <Icon type={props.icon} className="w-6 h-6" />}
					<span className="text-xs">{props.title}</span>
				</div>
			</button>
		);
	} else {
		return (
			<button
				type="button"
				onClick={props.onSelect}
				className="text-2 rounded-md hover:text-blue-600 focus:text-blue-600 hover:focus:text-blue-700"
			>
				<div className="flex flex-col items-center justify-center space-y-1">
					{props.icon && <Icon type={props.icon} className="w-6 h-6" />}
					<span className="text-xs">{props.title}</span>
				</div>
			</button>
		);
	}
};
