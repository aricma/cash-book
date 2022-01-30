export interface V1 {
	__version__: 'v1';
	global: {
		type: string;
	};
	settings: {
		save: string;
	};
	bookEntries: {
		create: {
			templates: {
				[templateId: string]: {
					templateId: string;
					date: string;
					diffTransaction?: { transactionId: string; value: number };
					transactions: {
						[transactionId: string]: string;
					};
				};
			};
		};
		selectedTemplateId?: string;
		templates: {
			[templateId: string]: {
				[date: string]: {
					date: string;
					templateId: string;
					transactions: {
						[transactionId: string]: number;
					};
				};
			};
		};
	};
	accounts: {
		create: {
			id?: string;
			type: string;
			name?: string;
			number?: string;
		};
		accounts: {
			[accountId: string]: {
				id: string;
				type: string;
				name: string;
				number: string;
			};
		};
	};
	transactions: {
		create: {
			id?: string;
			name?: string;
			cashierAccountId?: string;
			diffAccountId?: string;
			transactionIds: Array<string>;
			autoDiffInId?: string;
			autoDiffOutId?: string;
			transactions: {
				[transactionId: string]: {
					id: string;
					type: string;
					name?: string;
					accountId?: string;
				};
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
	};
}

export const toV1 = (state: any): V1 => {
	return {
		...state,
		__version__: 'v1',
	};
};
