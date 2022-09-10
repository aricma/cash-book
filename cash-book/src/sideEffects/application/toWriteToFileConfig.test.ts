import { toWriteToFileConfig, ToWriteToFileConfigRequest } from './toWriteToFileConfig';
import { WriteToFileConfig } from './makeWriteToFile';
import { ApplicationActionType, ExportFileType, ExportPayloadType } from '../../applicationState/actions';
import { ApplicationState } from '../../applicationState';
import * as MiscState from '../../features/application/state';
import * as SettingsState from '../../features/settings/state';
import * as BookingsState from '../../features/bookEntries/state';
import * as AccountsState from '../../features/accounts/state';
import * as TransactionsState from '../../features/transactions/state';
import { TransactionType } from '../../features/transactions/state';
import { AccountType } from '../../features/accounts/state';

describe(toWriteToFileConfig.name, () => {
	const applicationState: ApplicationState = {
		global: MiscState.initialState,
		settings: SettingsState.initialState,
		bookEntries: BookingsState.initialState,
		accounts: AccountsState.initialState,
		transactions: TransactionsState.initialState,
	};

	interface TestCase {
		message: string;
		request: ToWriteToFileConfigRequest;
		expected: WriteToFileConfig | null;
	}

	const testCases: Array<TestCase> = [
		{
			message: '',
			request: {
				unique: 'UUID',
				action: {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						date: '2022-08-10',
						range: 'month',
						fileType: ExportFileType.DATEV_CSV,
					},
				},
				appState: {
					...applicationState,
					accounts: {
						create: {
							type: AccountType.DEFAULT,
						},
						accounts: {
							A1: {
								id: 'A1',
								name: 'IN',
								type: AccountType.DEFAULT,
								number: '1000',
							},
							A2: {
								id: 'A2',
								name: 'OUT',
								type: AccountType.DEFAULT,
								number: '2000',
							},
							A3: {
								id: 'A3',
								name: 'CASH',
								type: AccountType.CASH_STATION,
								number: '3000',
							},
							A4: {
								id: 'A4',
								name: 'DIFF',
								type: AccountType.DIFFERENCE,
								number: '4000',
							},
						},
					},
					transactions: {
						create: {
							transactions: {},
							transactionIds: [],
						},
						transactions: {
							T1: {
								id: 'T1',
								name: 'T1',
								type: TransactionType.IN,
								accountId: 'A1',
							},
							T2: {
								id: 'T2',
								name: 'T2',
								type: TransactionType.OUT,
								accountId: 'A2',
							},
							T3: {
								id: 'T3',
								name: 'T3',
								type: TransactionType.SYS_IN,
								accountId: 'A4',
							},
							T4: {
								id: 'T4',
								name: 'T4',
								type: TransactionType.SYS_OUT,
								accountId: 'A4',
							},
						},
						templates: {
							A: {
								id: 'A',
								name: 'A',
								transactionIds: ['T1', 'T2'],
								cashierAccountId: 'A3',
								diffAccountId: 'A4',
								autoDiffInId: 'T3',
								autoDiffOutId: 'T4',
							},
						},
					},
					bookEntries: {
						create: {
							templates: {},
						},
						selectedTemplateId: 'A',
						templates: {
							A: {
								'2022-08-1': {
									templateId: 'A',
									date: '2022-08-1',
									transactions: {
										T1: '50.00',
										T2: '50.00',
									},
									cash: {
										start: '100.00',
										end: '100.00',
									},
								},
								'2022-08-10': {
									templateId: 'A',
									date: '2022-08-10',
									transactions: {
										T1: '100.00',
										T2: '100.00',
									},
									cash: {
										start: '100.00',
										end: '100.00',
									},
								},
								'2022-08-31': {
									templateId: 'A',
									date: '2022-08-31',
									transactions: {
										T1: '25.00',
										T2: '25.00',
									},
									cash: {
										start: '100.00',
										end: '100.00',
									},
								},
							},
						},
					},
				},
			},
			expected: {
				name: 'book-entries-a-2022-08-UUID.csv',
				content: `data:text/csv;charset=utf-8,\
"Währung";"VorzBetrag";"RechNr";"BelegDatum";"Belegtext";"UStSatz";"BU";"Gegenkonto";"Kost1";"Kost2";"Kostmenge";"Skonto";"Nachricht"
"EUR";"+50,00";"";"0108";"IN, T1";"";"";"1000";"";"";"";"";""
"EUR";"-50,00";"";"0108";"OUT, T2";"";"";"2000";"";"";"";"";""
"EUR";"+100,00";"";"1008";"IN, T1";"";"";"1000";"";"";"";"";""
"EUR";"-100,00";"";"1008";"OUT, T2";"";"";"2000";"";"";"";"";""
"EUR";"+25,00";"";"3108";"IN, T1";"";"";"1000";"";"";"";"";""
"EUR";"-25,00";"";"3108";"OUT, T2";"";"";"2000";"";"";"";"";""`,
			},
		},
	];

	testCases.forEach((testCase) => {
		test(testCase.message, () => {
			expect(toWriteToFileConfig(testCase.request)).toEqual(testCase.expected);
		});
	});
});
