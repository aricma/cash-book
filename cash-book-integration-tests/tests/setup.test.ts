import * as fs from 'fs';
import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { asyncForEach, download, makeBookEntry, makeCreateTemplate, makeCreateAccount } from '../utils';

test.beforeEach(async ({ page }) => {
	await page.goto(PAGE_URL);
});

test.describe('Setup', () => {
	test('golden path', async ({ page }) => {
		const EXPECTED_DATEV_EXPORT_PATH = process.env.PWD + '/fixtures/golden-path-expected-datev-export.csv';

		await asyncForEach((account: [string, string, string]) => makeCreateAccount(page)(...account))([
			['Cashier', 'Cashier 001', '1000'],
			['Difference', 'Difference', '3400'],
			['Default', 'Income', '9600'],
			['Default', 'Operating Expense', '4500'],
			['Default', 'Bank', '6500'],
		]);

		await makeCreateTemplate(page)('Temp 1', [
			['In', true, 'Income'],
			['Out', false, 'Operating Expense'],
			['Bank', false, 'Bank'],
		]);

		await asyncForEach(makeBookEntry(page))([
			['1', '100', '100', '90', null, '110'],
			['2', '110', '50', '50', null, '110'],
			['3', '110', '60', '70', null, '100'],
		]);

		await page.locator('button >> "Entries"').click();
		await page.waitForURL(PAGE_URL + '/book-entries');
		const path = await download(page)(page.locator('button >> "Export"').nth(0));
		const fileContent = fs.readFileSync(path, { encoding: 'utf8' });
		const expectedFileContent = fs.readFileSync(EXPECTED_DATEV_EXPORT_PATH, { encoding: 'utf8' });
		expect(fileContent).toEqual(expectedFileContent);
	});

	test.fixme('given no accounts', () => {});
	test.fixme('given accounts and no transactions', () => {});
	test.fixme('given accounts, transactions and no bookEntries', () => {});
});
