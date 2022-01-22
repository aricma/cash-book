export interface V2 {
	__version__: 'v2';
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
		selectedTemplateId?: string;
		templates: {
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
