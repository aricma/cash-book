import { test, expect } from '@playwright/test';
import {
	makeCreateBookEntry,
	uploadBackup,
	select,
	expectFilesToBeEqual,
	download,
	readFile,
	fillInput,
} from '../utils';
import { PAGE_URL } from '../environment';

test.describe('BookEntries', () => {
	test('create bookEntry without auto difference', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries/create');
		await select(page)('Set Template', 'Nikolassee');
		await makeCreateBookEntry(page)({
			date: ['2022', 'Februar', '1'],
			start: '100',
			transactions: [
				['7%', '100'],
				['Master', '50'],
				['Tagesabrechnung', '50'],
			],
			end: '100',
		});

		await expect(page).toHaveURL(PAGE_URL + '/book-entries');
		await expect(page.locator('#difference-account-aggregation >> "Kassendifferenz"')).toBeVisible();
		await expect(page.locator('#difference-account-aggregation >> "0"')).toBeVisible();
	});

	test('create bookEntry with auto difference', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries/create');
		await select(page)('Set Template', 'Nikolassee');
		await makeCreateBookEntry(page)({
			date: ['2022', 'Februar', '1'],
			start: '100',
			transactions: [
				['7%', '100'],
				['Master', '50'],
				['Tagesabrechnung', '40'],
			],
			end: '110',
		});

		await expect(page).toHaveURL(PAGE_URL + '/book-entries');
		await expect(page.locator('#difference-account-aggregation >> "Kassendifferenz"')).toBeVisible();
		await expect(page.locator('#difference-account-aggregation >> "10"')).toBeVisible();
	});

	test('edit bookEntry', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Nikolassee');

		await page.locator('button >> "Edit"').nth(0).click();

		await fillInput(page)('Privat', '50');
		await page.locator('#difference-account-message-id >> input[type="checkbox"]').click();

		await page.locator('button >> "Submit"').click();

		await page.locator('button >> "Yes"').click();

		await expect(page.locator('#difference-account-aggregation >> "-80.73"')).toBeVisible();
	});

	test('invalid bookEntry', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-book-entry-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Mitte');

		await expect(page.locator('#difference-account-aggregation >> "-8.48"')).toBeVisible();

		await page
			.locator(
				'div[data-test-id="book-entry"]:has-text("Mittwoch, 2. Februar 2022") >> svg[type="ICON_TYPE/EXCLAMATION/FILL"]'
			)
			.isVisible();

		await page.locator('div[data-test-id="book-entry"]:has-text("Mittwoch, 2. Februar 2022") >> "Edit"').click();

		await page.locator('#difference-account-message-id >> input[type="checkbox"]').click();

		await page.locator('button >> "Submit"').click();

		await page.locator('button >> "Yes"').click();

		const path = await download(page)(page.locator('button >> "Export"').nth(0));
		expectFilesToBeEqual(path, './fixtures/export-datev-feb.csv');
	});

	test('export month', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Nikolassee');

		const path = await download(page)(page.locator('button >> "Export"').nth(0));
		expectFilesToBeEqual(path, './fixtures/export-datev-month.csv');
	});

	test('export day', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Nikolassee');

		const path = await download(page)(page.locator('button >> "Export"').nth(1));
		expectFilesToBeEqual(path, './fixtures/export-datev-day.csv');
	});

	test('export invalid month', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-book-entries-false-result-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Nikolassee');

		await page.locator('button >> "Export"').nth(0).click();
		await expect(page.locator('"Failed To Export"')).toBeVisible();
	});

	test('export invalid day', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-book-entries-false-result-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');
		await select(page)('Set Template', 'Nikolassee');

		await page.locator('button >> "Export"').nth(1).click();
		await expect(page.locator('"Failed To Export"')).toBeVisible();
	});
});
