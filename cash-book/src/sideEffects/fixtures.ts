import { AccountType } from '../features/accounts/state';
import { TransactionType } from '../features/transactions/state';
import { ApplicationState } from '../applicationState';
import { SettingsSaveType } from '../features/settings/state';
import { GlobalStateType } from '../features/application/state';

export const partialApplicationState: ApplicationState = {
	global: {
		type: GlobalStateType.DEFAULT,
	},
	settings: {
		save: SettingsSaveType.AUTO,
	},
	accounts: {
		create: {
			type: AccountType.DEFAULT,
		},
		accounts: {
			A: {
				id: 'A',
				type: AccountType.DEFAULT,
				name: 'Acc A',
				number: '1000',
			},
			B: {
				id: 'B',
				type: AccountType.DEFAULT,
				name: 'Acc B',
				number: '2000',
			},
			C: {
				id: 'C',
				type: AccountType.CASH_STATION,
				name: 'Acc C',
				number: '3000',
			},
			D: {
				id: 'D',
				type: AccountType.DIFFERENCE,
				name: 'Acc D',
				number: '4000',
			},
		},
	},
	transactions: {
		create: {
			transactions: {},
			transactionIds: [],
		},
		templates: {
			'1': {
				id: '1',
				name: 'Temp 1',
				diffAccountId: 'B',
				cashierAccountId: 'C',
				autoDiffInId: 'T-3',
				autoDiffOutId: 'T-4',
				transactionIds: ['T-1', 'T-2', 'T-3', 'T-4'],
			},
		},
		transactions: {
			'T-1': {
				id: 'T-1',
				type: TransactionType.IN,
				name: 'Trans 1',
				accountId: 'A',
			},
			'T-2': {
				id: 'T-2',
				type: TransactionType.OUT,
				name: 'Trans 2',
				accountId: 'B',
			},
			'T-3': {
				id: 'T-3',
				type: TransactionType.SYS_IN,
				name: 'Trans 3',
				accountId: 'D',
			},
			'T-4': {
				id: 'T-4',
				type: TransactionType.SYS_OUT,
				name: 'Trans 4',
				accountId: 'D',
			},
		},
	},
	bookEntries: {
		create: {
			templates: {},
		},
		selectedTemplateId: '1',
		templates: {
			'1': {
				'2000-1-1': {
					date: '2000-1-1',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '100.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
				'2000-1-2': {
					date: '2000-1-2',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '50.00',
						'T-4': '50.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
				'2000-1-3': {
					date: '2000-1-3',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '150.00',
						'T-3': '50.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
				'2000-2-1': {
					date: '2000-2-1',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '100.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
				'2000-3-1': {
					date: '2000-3-1',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '100.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
				'2000-3-2': {
					date: '2000-3-2',
					templateId: '1',
					transactions: {
						'T-1': '100.00',
						'T-2': '90.00',
					},
					cash: {
						start: '0.00',
						end: '0.00',
					},
				},
			},
		},
	},
};
