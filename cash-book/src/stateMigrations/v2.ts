import {V1} from './v1';


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
					diffTransaction?: { transactionId: string; value: string };
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

export const toV2 = (state: V1): V2 => {
	return {
		...state,
		__version__: 'v2',
		bookEntries: {
			...state.bookEntries,
			create: {
				templates: {
					...Object.fromEntries(
						Object.entries(state.bookEntries.create.templates).map(([id, entry]) => {
							return [
								id,
								{
									...entry,
									diffTransaction: entry.diffTransaction ? {
										...entry.diffTransaction,
										value: String(entry.diffTransaction.value),
									} : undefined,
									cash: {
										start: '0',
										end: '0',
									},
								},
							];
						}),
					),
				},
			},
			templates: {
				...Object.fromEntries(
					Object.entries(state.bookEntries.templates).map(([id, template]) => {
						return [
							id,
							{
								...Object.fromEntries(
									Object.entries(template).map(([id, entry]) => {
										return [
											id,
											{
												...entry,
												cash: {
													start: '0',
													end: '0',
												},
												transactions: {
													...Object.fromEntries(
														Object.entries(entry.transactions).map(([id, value]) => {
															return [id, String(value)];
														}),
													),
												},
											},
										];
									}),
								),
							},
						];
					}),
				),
			},
		},
	};
};
