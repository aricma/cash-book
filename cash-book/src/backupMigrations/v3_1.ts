import { V3 } from './v3';

export interface V3_1 {
	__version__: 'v3.1';
	bookEntries: {
		[templateId: string]: {
			[date: string]: {
				date: string;
				templateId: string;
				cash: {
					start: string;
					end: string;
				};
				transactions: {
					[transactionId: string]: string;
				};
			};
		};
	};
	accounts: {
		[accountId: string]: {
			id: string;
			type: string;
			name: string;
			number: string;
		};
	};
	templates: {
		[templateId: string]: {
			id: string;
			name: string;
			cashierAccountId: string;
			diffAccountId: string;
			transactionIds: Array<string>;
			autoDiffInId: string;
			autoDiffOutId: string;
		};
	};
	transactions: {
		[transactionId: string]: {
			id: string;
			type: string;
			accountId: string;
			name: string;
		};
	};
}

export const toV3_1 = (state: V3): V3_1 => {
	return {
		...state,
		__version__: 'v3.1',
		templates: {
			...Object.fromEntries(
				Object.entries(state.templates).map(([key, value]) => {
					return [
						key,
						{
							...value,
							transactions: undefined,
							transactionIds: value.transactions,
						},
					];
				})
			),
		},
	};
};
