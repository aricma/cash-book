import { V3 } from './v3';
import { V3_1, toV3_1 } from './v3_1';

describe(toV3_1.name, () => {
	test('given a state v3 empty transactions, then returns state v3_1', () => {
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

		const v3_1: V3_1 = {
			__version__: 'v3.1',
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
					transactionIds: ['1', '2'],
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

		expect(toV3_1(v3)).toEqual(v3_1);
	});
});
