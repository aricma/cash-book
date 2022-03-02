import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import {
	asyncForEach,
	download,
	makeCreateBookEntry,
	makeCreateTemplate,
	makeCreateAccount,
	readFile,
	uploadBackup,
	sleep,
	expectFilesToBeEqual,
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

		await asyncForEach(makeCreateBookEntry(page))([
			{
				date: ['2022', 'Februar', '1'],
				start: '100',
				transactions: [
					['In', '100'],
					['Out', '90'],
					['Bank', null],
				],
				end: '110',
			},
			{
				date: ['2022', 'Februar', '2'],
				start: '110',
				transactions: [
					['In', '50'],
					['Out', '50'],
					['Bank', null],
				],
				end: '110',
			},
			{
				date: ['2022', 'Februar', '3'],
				start: '110',
				transactions: [
					['In', '60'],
					['Out', '70'],
					['Bank', null],
				],
				end: '100',
			},
		]);

		await page.locator('button >> "Entries"').click();
		await page.waitForURL(PAGE_URL + '/book-entries');
		const path = await download(page)(page.locator('button >> "Export"').nth(0));
		expectFilesToBeEqual(path, './fixtures/golden-path-expected-datev-export.csv');
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
