import { Export, ExportFileType, ExportPayloadType, ApplicationActionType } from '../../applicationState/actions';
import { AccountType } from '../../features/accounts/state';
import { WriteToFileConfig } from './makeWriteToFile';
import { channel, Channel } from 'redux-saga';
import { makeExportsWorker } from './makeExportsWorker';
import { toWriteToFileConfig } from './toWriteToFileConfig';
import { toCSVContent, toJSONContent } from '../../misc/utils';
import { latestVersion } from '../../backupMigrations';
import { headline, INVALID_ROW_RESULT_MESSAGE } from './datev';
import { expectSaga } from 'redux-saga-test-plan';
import { partialApplicationState } from '../fixtures';
import { ApplicationState } from '../../applicationState';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

const unique = 'UNIQUE';

describe(toWriteToFileConfig.name, () => {
	describe(ExportPayloadType.ACCOUNTS, () => {
		describe(ExportFileType.CSV, () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.ACCOUNTS,
						fileType: ExportFileType.CSV,
					},
				};
				const expected: WriteToFileConfig = {
					name: 'accounts-UNIQUE.csv',
					content: toCSVContent([
						['id', 'name', 'type', 'number'],
						['A', 'Acc A', AccountType.DEFAULT, '1000'],
						['B', 'Acc B', AccountType.DEFAULT, '2000'],
						['C', 'Acc C', AccountType.CASH_STATION, '3000'],
						['D', 'Acc D', AccountType.DIFFERENCE, '4000'],
					]),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});

		describe(ExportFileType.JSON, () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.ACCOUNTS,
						fileType: ExportFileType.JSON,
					},
				};
				const expected: WriteToFileConfig = {
					name: 'accounts-UNIQUE.json',
					content: toJSONContent(partialApplicationState.accounts.accounts),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});

		describe(ExportFileType.DATEV_CSV, () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.ACCOUNTS,
						fileType: ExportFileType.DATEV_CSV,
					},
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(null);
			});
		});
	});

	describe(ExportPayloadType.TRANSACTIONS, () => {
		describe(ExportFileType.JSON, () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.TRANSACTIONS,
						fileType: ExportFileType.JSON,
					},
				};
				const expected: WriteToFileConfig = {
					name: 'transactions-UNIQUE.json',
					content: toJSONContent({
						templates: partialApplicationState.transactions.templates,
						transactions: partialApplicationState.transactions.transactions,
					}),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});
	});

	describe(ExportPayloadType.BOOK_ENTRIES, () => {
		describe(ExportFileType.DATEV_CSV + '-day', () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'day',
						date: '2000-1-1',
					},
				};
				const expected: WriteToFileConfig = {
					name: 'book-entry-temp-1-2000-01-01-UNIQUE.csv',
					content: toCSVContent([
						headline,
						['EUR', '+100,00', '', '0101', 'Acc A, Trans 1', '', '', '1000', '', '', '', '', ''],
						['EUR', '-100,00', '', '0101', 'Acc B, Trans 2', '', '', '2000', '', '', '', '', ''],
					]),
				};
				const result = toWriteToFileConfig({
					appState: partialApplicationState as any,
					unique: unique,
					action: action,
				});
				expect(result).toEqual(expected);
			});

			test('given invalid data, when called, then throws', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'day',
						date: '2000-3-2',
					},
				};
				const result = () =>
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					});
				expect(result).toThrow(Error(INVALID_ROW_RESULT_MESSAGE('10.00')));
			});
		});

		describe(ExportFileType.DATEV_CSV + '-month', () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'month',
						date: '2000-1-5',
					},
				};
				const expected: WriteToFileConfig = {
					name: 'book-entries-temp-1-2000-01-UNIQUE.csv',
					content: toCSVContent([
						headline,
						['EUR', '+100,00', '', '0101', 'Acc A, Trans 1', '', '', '1000', '', '', '', '', ''],
						['EUR', '-100,00', '', '0101', 'Acc B, Trans 2', '', '', '2000', '', '', '', '', ''],

						['EUR', '+100,00', '', '0201', 'Acc A, Trans 1', '', '', '1000', '', '', '', '', ''],
						['EUR', '-50,00', '', '0201', 'Acc B, Trans 2', '', '', '2000', '', '', '', '', ''],
						['EUR', '-50,00', '', '0201', 'Acc D, Trans 4', '', '', '4000', '', '', '', '', ''],

						['EUR', '+100,00', '', '0301', 'Acc A, Trans 1', '', '', '1000', '', '', '', '', ''],
						['EUR', '-150,00', '', '0301', 'Acc B, Trans 2', '', '', '2000', '', '', '', '', ''],
						['EUR', '+50,00', '', '0301', 'Acc D, Trans 3', '', '', '4000', '', '', '', '', ''],
					]),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});

			test('given invalid data, when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'month',
						date: '2000-3-1',
					},
				};
				const result = () =>
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					});
				expect(result).toThrow(Error(INVALID_ROW_RESULT_MESSAGE('10.00')));
			});
		});

		describe(ExportFileType.JSON + '-day', () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.JSON,
						range: 'day',
						date: '2000-1-1',
					},
				};
				const expected: WriteToFileConfig = {
					name: 'book-entry-temp-1-2000-01-01-UNIQUE.json',
					content: toJSONContent(partialApplicationState.bookEntries.templates['1']['2000-1-1']),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});

		describe(ExportFileType.JSON + '-month', () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.JSON,
						range: 'month',
						date: '2000-1-6',
					},
				};
				const expected: WriteToFileConfig = {
					name: 'book-entries-temp-1-2000-01-UNIQUE.json',
					content: toJSONContent({
						'2000-1-1': partialApplicationState.bookEntries.templates['1']['2000-1-1'],
						'2000-1-2': partialApplicationState.bookEntries.templates['1']['2000-1-2'],
						'2000-1-3': partialApplicationState.bookEntries.templates['1']['2000-1-3'],
					}),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});

		describe('Missing Data', () => {
			test('given state without selectedTemplateId, when called, returns null', () => {
				const stateWithoutSelectedTemplateId: ApplicationState = {
					...partialApplicationState,
					bookEntries: {
						...partialApplicationState.bookEntries,
						selectedTemplateId: undefined,
					},
				};
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'day',
						date: '2000-1-1',
					},
				};
				expect(
					toWriteToFileConfig({
						appState: stateWithoutSelectedTemplateId as any,
						unique: unique,
						action: action,
					})
				).toEqual(null);
			});

			test('given state without matching book entry, when called, returns null', () => {
				const action1: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.DATEV_CSV,
						range: 'day',
						date: '2000-1-5',
					},
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action1,
					})
				).toEqual(null);

				const action2: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						fileType: ExportFileType.JSON,
						range: 'day',
						date: '2000-1-5',
					},
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action2,
					})
				).toEqual(null);
			});
		});

		describe('FALSE_EXPORT_FILE_TYPE', () => {
			test('when called, returns null', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.BOOK_ENTRIES,
						// @ts-ignore
						fileType: 'FALSE_EXPORT_FILE_TYPE',
						range: 'day',
						date: '2000-1-1',
					},
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(null);
			});
		});
	});

	describe(ExportPayloadType.ALL, () => {
		describe(ExportFileType.JSON, () => {
			test('when called, then returns expected', () => {
				const action: Export = {
					type: ApplicationActionType.APPLICATION_EXPORT,
					payload: {
						type: ExportPayloadType.ALL,
						fileType: ExportFileType.JSON,
					},
				};
				const expected: WriteToFileConfig = {
					name: 'backup-UNIQUE.json',
					content: toJSONContent({
						__version__: latestVersion,
						accounts: partialApplicationState.accounts.accounts,
						templates: partialApplicationState.transactions.templates,
						transactions: partialApplicationState.transactions.transactions,
						bookEntries: partialApplicationState.bookEntries.templates,
					}),
				};
				expect(
					toWriteToFileConfig({
						appState: partialApplicationState as any,
						unique: unique,
						action: action,
					})
				).toEqual(expected);
			});
		});
	});

	describe('FALSE_EXPORT_PAYLOAD_TYPE', () => {
		test('when called, returns null', () => {
			const action: Export = {
				type: ApplicationActionType.APPLICATION_EXPORT,
				payload: {
					// @ts-ignore
					type: 'FALSE_EXPORT_PAYLOAD_TYPE',
					fileType: ExportFileType.DATEV_CSV,
				},
			};
			expect(
				toWriteToFileConfig({
					appState: partialApplicationState as any,
					unique: unique,
					action: action,
				})
			).toEqual(null);
		});
	});
});

describe(makeExportsWorker.name, () => {
	const action: Export = {
		type: ApplicationActionType.APPLICATION_EXPORT,
		payload: {
			type: ExportPayloadType.ALL,
			fileType: ExportFileType.JSON,
		},
	};

	test('given exportFilesQueue returns not null, when called, then it puts the request in the queue', async () => {
		// @ts-ignore
		const queue = { put: jest.fn() } as Channel<any>;
		const worker = makeExportsWorker({
			exportFilesQueue: queue,
			makeUniqueID: () => unique,
			toExportFileConfig: () => ({
				name: 'file.txt',
				content: 'data...',
			}),
		});
		await expectSaga(worker).dispatch(action).run({ silenceTimeout: true });
		expect(queue.put).toBeCalledWith({
			name: 'file.txt',
			content: 'data...',
		});
	});

	test('given getUnique fails, when called, then calls put with expected', async () => {
		const worker = makeExportsWorker({
			exportFilesQueue: channel<any>(),
			makeUniqueID: () => {
				throw Error('ANY');
			},
			toExportFileConfig: () => ({
				name: '',
				content: '',
			}),
		});
		await expectSaga(worker)
			.dispatch(action)
			.put({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: new CashBookError(CashBookErrorType.FAILED_TO_EXPORT, Error('ANY')),
			})
			.run({
				silenceTimeout: true,
				timeout: 250,
			});
	});

	test('given exportFilesQueue returns null, when called, then it continues', async () => {
		// @ts-ignore
		const queue = { put: jest.fn() } as Channel<any>;
		const worker = makeExportsWorker({
			exportFilesQueue: queue,
			makeUniqueID: () => unique,
			toExportFileConfig: () => null,
		});
		await expectSaga(worker).dispatch(action).run({
			silenceTimeout: true,
			timeout: 250,
		});
		expect(queue.put).not.toBeCalled();
	});
});
