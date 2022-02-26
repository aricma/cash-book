import {
	validateCreateTransaction,
	validateCreateTemplate,
	MISSING_NAME_MESSAGE,
	MISSING_ACCOUNT_MESSAGE,
	MISSING_CASHIER_ACCOUNT_MESSAGE,
	MISSING_DIFF_ACCOUNT_MESSAGE,
} from './validation';
import { CreateTransaction, TransactionType, CreateTemplate } from '../state';

describe(validateCreateTransaction.name, () => {
	const baseRequest: CreateTransaction = {
		id: 'ANY',
		type: TransactionType.OUT,
	};

	test('given no data, when called, then returns expected response', () => {
		const request: CreateTransaction = {
			...baseRequest,
		};
		const expectedResponse = {
			name: MISSING_NAME_MESSAGE,
			accountId: MISSING_ACCOUNT_MESSAGE,
		};
		expect(validateCreateTransaction(request)).toEqual(expectedResponse);
	});

	test('given no name, when called, then returns expected response', () => {
		const request: CreateTransaction = {
			...baseRequest,
			accountId: 'ANY',
		};
		const expectedResponse = {
			name: MISSING_NAME_MESSAGE,
		};
		expect(validateCreateTransaction(request)).toEqual(expectedResponse);
	});

	test('given no accountId, when called, then returns expected response', () => {
		const request: CreateTransaction = {
			...baseRequest,
			name: 'NAME',
		};
		const expectedResponse = {
			accountId: MISSING_ACCOUNT_MESSAGE,
		};
		expect(validateCreateTransaction(request)).toEqual(expectedResponse);
	});

	test('given valid data, when called, then returns null', () => {
		const request: CreateTransaction = {
			...baseRequest,
			name: 'NAME',
			accountId: 'ANY',
		};
		expect(validateCreateTransaction(request)).toBe(null);
	});
});

describe(validateCreateTemplate.name, () => {
	const baseRequest: CreateTemplate = {
		id: 'ANY',
		transactions: {},
		transactionIds: [],
	};

	test('given no data, when called, then returns expected response', () => {
		const request: CreateTemplate = {
			...baseRequest,
		};
		const expectedResponse = {
			name: MISSING_NAME_MESSAGE,
			cashierAccountId: MISSING_CASHIER_ACCOUNT_MESSAGE,
			diffAccountId: MISSING_DIFF_ACCOUNT_MESSAGE,
		};
		expect(validateCreateTemplate(request)).toEqual(expectedResponse);
	});

	test('given valid data, when called, then returns null', () => {
		const request: CreateTemplate = {
			...baseRequest,
			name: 'NAME',
			cashierAccountId: 'ANY',
			diffAccountId: 'ANY',
		};
		expect(validateCreateTemplate(request)).toEqual(null);
	});
});
