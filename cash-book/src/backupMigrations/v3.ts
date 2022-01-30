import { V2_1 } from './v2_1';

export interface V3 {
	__version__: 'v3';
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
			transactions: Array<string>;
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

export const toV3 = (state: V2_1): V3 => {
	return {
		__version__: 'v3',
		accounts: state.accounts.accounts,
		templates: state.transactions.templates,
		transactions: state.transactions.transactions,
		bookEntries: state.bookEntries.templates,
	};
};
