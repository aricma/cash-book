import { V2 } from './v2';
import { V1 } from './v1';
import { compactObject } from '../models/utils';

export interface V2_1 {
	__version__: 'v2.1';
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

export const toV2_1 = (state: V2): V2_1 => {
	return {
		...state,
		__version__: 'v2.1',
		bookEntries: {
			...state.bookEntries,
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
												transactions: {
													...Object.fromEntries(
														Object.entries(entry.transactions)
															.filter(([_, value]) => !/^0+([.]0*)?$/.test(value))
															.map(([id, value]) => [id, String(value)])
													),
												},
											},
										];
									})
								),
							},
						];
					})
				),
			},
		},
	};
};
