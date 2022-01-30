import React from 'react';
import { IconType } from '../../models/props';
import { ApplicationActionType } from '../../applicationState/actions';
import { dispatch } from '../../applicationState';
import { Icon } from '../../components/icons';

const timeouts = [100, 200, 300, 50, 200, 1000, 50];

export const Home: React.FC = () => {
	const [loading, setLoading] = React.useState<number>(0);
	React.useEffect(() => {
		const sleep = setTimeout(() => {
			if (timeouts.length === loading) {
				dispatch({
					type: ApplicationActionType.ROUTER_FALLBACK,
				});
			} else {
				setLoading((prev) => prev + 1);
			}
		}, timeouts[loading]);
		return () => clearTimeout(sleep);
		// eslint-disable-next-line
	}, [loading]);

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-blue-100 flex flex-col items-center justify-center space-y-4">
			<h1 className="text-blue-600 font-extrabold text-4xl grid grid-cols-[repeat(3,_max-content)] grid-rows-[repeat(2,_max-content)]">
				<Icon type={IconType.CASH_BOOK} className="row-span-2 w-[4rem]" />
				<span className="self-end justify-self-end">cash</span>
				<span className="self-end justify-self-start">Book</span>
				<div className="place-self-center col-start-2 col-span-2 flex space-x-1">
					{timeouts.map((_, index) => (
						<React.Fragment key={index}>
							{index <= loading ? (
								<div className="h-2 w-5 bg-blue-600 rounded-md" />
							) : (
								<div className="h-2 w-5 bg-blue-200 rounded-md" />
							)}
						</React.Fragment>
					))}
				</div>
			</h1>
		</div>
	);
};
