import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import {
	asyncForEach,
	download,
	makeBookEntry,
	makeCreateTemplate,
	makeCreateAccount,
	readFile,
	uploadBackup,
	sleep,
} from '../utils';

test.describe('Setup', () => {
	test('golden path', async ({ page }) => {
		await page.goto(PAGE_URL);
		await asyncForEach((account: [string, string, string]) => makeCreateAccount(page)(...account))([
			['Cashier', 'Cashier 001', '1000'],
			['Difference', 'Difference', '3400'],
			['Default', 'Income', '9600'],
			['Default', 'Operating Expense', '4500'],
			['Default', 'Bank', '6500'],
		]);

		await makeCreateTemplate(page)({
			name: 'Temp 1',
			transactions: [
				['In', true, 'Income'],
				['Out', false, 'Operating Expense'],
				['Bank', false, 'Bank'],
			],
		});

		await asyncForEach(makeBookEntry(page))([
			['1', '100', '100', '90', null, '110'],
			['2', '110', '50', '50', null, '110'],
			['3', '110', '60', '70', null, '100'],
		]);

		await page.locator('button >> "Entries"').click();
		await page.waitForURL(PAGE_URL + '/book-entries');
		const path = await download(page)(page.locator('button >> "Export"').nth(0));
		const fileContent = readFile(path);
		const expectedFileContent = readFile('./fixtures/golden-path-expected-datev-export.csv');
		expect(fileContent).toEqual(expectedFileContent);
	});

	test('given no accounts', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-empty-v3_1.json');
		await page.goto(PAGE_URL);
		await sleep(2000);
		await expect(page).toHaveURL(PAGE_URL + '/accounts');
	});

	test('given accounts and neither transactions nor book entries', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL);
		await sleep(2000);
		await expect(page).toHaveURL(PAGE_URL + '/transactions');
	});

	test('given accounts, transactions and no book entries', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
		await page.goto(PAGE_URL);
		await sleep(2000);
		await expect(page).toHaveURL(PAGE_URL + '/book-entries/create');
	});

	test('given accounts, transactions and book entries', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-account-transactions-and-book-entries-v3_1.json');
		await page.goto(PAGE_URL);
		await sleep(2000);
		await expect(page).toHaveURL(PAGE_URL + '/book-entries/create');
	});
});
