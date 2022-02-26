import { ApplicationState } from '../applicationState';
import { GlobalStateType } from '../features/application/state';
import { SettingsSaveType } from '../features/settings/state';
import { AccountType } from '../features/accounts/state';
import { TransactionType } from '../features/transactions/state';
import { LatestVersion, latestVersion } from '../backupMigrations';
import { toBackup } from './toBackup';

describe(toBackup.name, () => {
	test('when called then returns expected backup', () => {
		const state: ApplicationState = {
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
					IN: {
						type: AccountType.DEFAULT,
						id: 'IN',
						name: 'NAME',
						number: '1000',
					},
					OUT: {
						type: AccountType.DEFAULT,
						id: 'OUT',
						name: 'NAME',
						number: '2000',
					},
					DIFF: {
						type: AccountType.DIFFERENCE,
						id: 'DIFF',
						name: 'NAME',
						number: '3000',
					},
					CASH: {
						type: AccountType.CASH_STATION,
						id: 'CASH',
						name: 'NAME',
						number: '4000',
					},
				},
			},
			bookEntries: {
				create: {
					templates: {},
				},
				templates: {
					A: {
						'2000-1-1': {
							templateId: 'A',
							date: '2000-1-1',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {},
						},
						'2000-1-2': {
							templateId: 'A',
							date: '2000-1-2',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {},
						},
						'2000-1-3': {
							templateId: 'A',
							date: '2000-1-3',
							cash: {
								start: '100.00',
								end: '100.00',
							},
							transactions: {},
						},
					},
				},
			},
			transactions: {
				create: {
					transactions: {},
					transactionIds: [],
				},
				templates: {
					A: {
						id: 'A',
						name: 'NAME',
						diffAccountId: 'DIFF',
						cashierAccountId: 'CASH',
						autoDiffInId: '3',
						autoDiffOutId: '4',
						transactionIds: ['1', '2', '5', '6'],
					},
				},
				transactions: {
					1: {
						id: '1',
						type: TransactionType.IN,
						name: 'NAME',
						accountId: 'IN',
					},
					2: {
						id: '2',
						type: TransactionType.OUT,
						name: 'NAME',
						accountId: 'OUT',
					},
					3: {
						id: '3',
						type: TransactionType.SYS_IN,
						name: 'NAME',
						accountId: 'DIFF',
					},
					4: {
						id: '4',
						type: TransactionType.SYS_OUT,
						name: 'NAME',
						accountId: 'DIFF',
					},
					5: {
						id: '5',
						type: TransactionType.OUT,
						name: 'NAME',
						accountId: 'OUT',
					},
					6: {
						id: '6',
						type: TransactionType.OUT,
						name: 'NAME',
						accountId: 'OUT',
					},
				},
			},
		};
		const expectedBackup: LatestVersion = {
			__version__: latestVersion,
			accounts: {
				IN: {
					type: AccountType.DEFAULT,
					id: 'IN',
					name: 'NAME',
					number: '1000',
				},
				OUT: {
					type: AccountType.DEFAULT,
					id: 'OUT',
					name: 'NAME',
					number: '2000',
				},
				DIFF: {
					type: AccountType.DIFFERENCE,
					id: 'DIFF',
					name: 'NAME',
					number: '3000',
				},
				CASH: {
					type: AccountType.CASH_STATION,
					id: 'CASH',
					name: 'NAME',
					number: '4000',
				},
			},
			templates: {
				A: {
					id: 'A',
					name: 'NAME',
					diffAccountId: 'DIFF',
					cashierAccountId: 'CASH',
					autoDiffInId: '3',
					autoDiffOutId: '4',
					transactionIds: ['1', '2', '5', '6'],
				},
			},
			transactions: {
				1: {
					id: '1',
					type: TransactionType.IN,
					name: 'NAME',
					accountId: 'IN',
				},
				2: {
					id: '2',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
				3: {
					id: '3',
					type: TransactionType.SYS_IN,
					name: 'NAME',
					accountId: 'DIFF',
				},
				4: {
					id: '4',
					type: TransactionType.SYS_OUT,
					name: 'NAME',
					accountId: 'DIFF',
				},
				5: {
					id: '5',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
				6: {
					id: '6',
					type: TransactionType.OUT,
					name: 'NAME',
					accountId: 'OUT',
				},
			},
			bookEntries: {
				A: {
					'2000-1-1': {
						templateId: 'A',
						date: '2000-1-1',
						cash: {
							start: '100.00',
							end: '100.00',
						},
						transactions: {},
					},
					'2000-1-2': {
						templateId: 'A',
						date: '2000-1-2',
						cash: {
							start: '100.00',
							end: '100.00',
						},
						transactions: {},
					},
					'2000-1-3': {
						templateId: 'A',
						date: '2000-1-3',
						cash: {
							start: '100.00',
							end: '100.00',
						},
						transactions: {},
					},
				},
			},
		};
		expect(toBackup(state)).toEqual(expectedBackup);
	});
});
