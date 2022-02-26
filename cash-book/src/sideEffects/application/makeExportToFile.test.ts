import { channel } from 'redux-saga';
import { makeExportToFile, ExportFileConfig } from './makeExportToFile';
import { expectSaga } from 'redux-saga-test-plan';
import { ErrorSet, ApplicationActionType } from '../../applicationState/actions';

describe(makeExportToFile.name, () => {
	const callback = jest.fn();
	const queue = channel<ExportFileConfig>();
	const itemInQueue1: ExportFileConfig = {
		name: 'some.txt',
		content: 'abc',
	};
	const itemInQueue2: ExportFileConfig = {
		name: 'other.txt',
		content: 'def',
	};

	beforeEach(() => {
		callback.mockReset();
		queue.put(itemInQueue1);
		queue.put(itemInQueue2);
	});

	test('given something in the queue, then calls export with expected', async () => {
		const worker = makeExportToFile({
			exportFilesQueue: queue,
			exportToFile: callback,
		});
		await expectSaga(worker).run({ silenceTimeout: true });

		expect(callback).toBeCalledWith(itemInQueue1.content, itemInQueue1.name);
		expect(callback).toBeCalledWith(itemInQueue2.content, itemInQueue2.name);
	});

	test('given exportFile fails, then puts error action', async () => {
		const worker = makeExportToFile({
			exportFilesQueue: queue,
			exportToFile: () => {
				throw Error('ANY');
			},
		});
		await expectSaga(worker)
			.put<ErrorSet>({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: Error('ANY'),
			})
			.run({ silenceTimeout: true });

		expect(callback).not.toBeCalled();
	});
});
