import { channel } from 'redux-saga';
import { makeWriteToFile, WriteToFileConfig } from './makeWriteToFile';
import { expectSaga } from 'redux-saga-test-plan';
import { ErrorSet, ApplicationActionType } from '../../applicationState/actions';
import { CashBookError, CashBookErrorType } from '../../models/cashBookError';

describe(makeWriteToFile.name, () => {
	const callback = jest.fn();
	const queue = channel<WriteToFileConfig>();
	const itemInQueue1: WriteToFileConfig = {
		name: 'some.txt',
		content: 'abc',
	};
	const itemInQueue2: WriteToFileConfig = {
		name: 'other.txt',
		content: 'def',
	};

	beforeEach(() => {
		callback.mockReset();
		queue.put(itemInQueue1);
		queue.put(itemInQueue2);
	});

	test('given something in the queue, then calls export with expected', async () => {
		const worker = makeWriteToFile({
			writeToFilesQueue: queue,
			writeToFile: callback,
		});
		await expectSaga(worker).run({ silenceTimeout: true });

		expect(callback).toBeCalledWith(itemInQueue1.content, itemInQueue1.name);
		expect(callback).toBeCalledWith(itemInQueue2.content, itemInQueue2.name);
	});

	test('given exportFile fails, then puts error action', async () => {
		const worker = makeWriteToFile({
			writeToFilesQueue: queue,
			writeToFile: () => {
				throw Error('ANY');
			},
		});
		await expectSaga(worker)
			.put<ErrorSet>({
				type: ApplicationActionType.APPLICATION_ERROR_SET,
				error: new CashBookError(CashBookErrorType.FAILED_TO_WRITE_TO_FILE, Error('ANY')),
			})
			.run({ silenceTimeout: true });

		expect(callback).not.toBeCalled();
	});
});
