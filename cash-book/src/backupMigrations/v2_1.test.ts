import { V2 } from './v2';
import { V2_1, toV2_1 } from './v2_1';

describe(toV2_1.name, () => {
	test('given a state v2 empty transactions, then returns state v2_1', () => {
		const v2: V2 = {
			__version__: 'v2',
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
				accounts: {},
			},
			transactions: {
				create: {
					transactionIds: [],
					transactions: {},
				},
				templates: {},
				transactions: {},
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
								start: '0',
								end: '0',
							},
							transactions: {
								'T-1': '10',
								'T-2': '15',
								'T-3': '0',
								'T-4': '0.0',
								'T-5': '0.00',
								'T-6': '00.00',
								'T-7': '00.0',
								'T-8': '00.',
								'T-9': '00',
							},
						},
					},
				},
			},
		};

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
				accounts: {},
			},
			transactions: {
				create: {
					transactionIds: [],
					transactions: {},
				},
				templates: {},
				transactions: {},
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
								start: '0',
								end: '0',
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

		expect(toV2_1(v2)).toEqual(v2_1);
	});
});
