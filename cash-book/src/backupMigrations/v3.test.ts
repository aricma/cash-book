import { V3, toV3 } from './v3';
import { V2_1 } from './v2_1';

describe(toV3.name, () => {
	test('given a state v2 empty transactions, then returns state v2_1', () => {
		const v2_1: V2_1 = {
			__version__: 'v2.1',
			global: {
				type: '',
			},
			settings: {
				save: '',
			},
			accounts: {
				create: {
					type: '',
				},
				accounts: {
					'1': {
						id: '1',
						name: 'Bank',
						type: 'SOME',
						number: '1000',
					},
				},
			},
			transactions: {
				create: {
					transactionIds: [],
					transactions: {},
				},
				templates: {
					'1': {
						id: '1',
						name: 'T-1',
						autoDiffInId: '2',
						autoDiffOutId: '3',
						cashierAccountId: '4',
						diffAccountId: '5',
						transactions: ['1', '2'],
					},
				},
				transactions: {
					'1': {
						id: '1',
						name: 'in',
						type: 'IN',
						accountId: '7',
					},
					'2': {
						id: '2',
						name: 'out',
						type: 'OUT',
						accountId: '8',
					},
				},
			},
			bookEntries: {
				create: {
					templates: {},
				},
				templates: {
					'1': {
						'0-0-1': {
							templateId: 'A',
							date: '0-0-1',
							cash: {
								start: '10',
								end: '10',
							},
							transactions: {
								'T-1': '10',
								'T-2': '15',
							},
						},
					},
				},
			},
		};

		const v3: V3 = {
			__version__: 'v3',
			accounts: {
				'1': {
					id: '1',
					name: 'Bank',
					type: 'SOME',
					number: '1000',
				},
			},

			templates: {
				'1': {
					id: '1',
					name: 'T-1',
					autoDiffInId: '2',
					autoDiffOutId: '3',
					cashierAccountId: '4',
					diffAccountId: '5',
					transactions: ['1', '2'],
				},
			},
			transactions: {
				'1': {
					id: '1',
					name: 'in',
					type: 'IN',
					accountId: '7',
				},
				'2': {
					id: '2',
					name: 'out',
					type: 'OUT',
					accountId: '8',
				},
			},
			bookEntries: {
				'1': {
					'0-0-1': {
						templateId: 'A',
						date: '0-0-1',
						cash: {
							start: '10',
							end: '10',
						},
						transactions: {
							'T-1': '10',
							'T-2': '15',
						},
					},
				},
			},
		};

		expect(toV3(v2_1)).toEqual(v3);
	});
});
