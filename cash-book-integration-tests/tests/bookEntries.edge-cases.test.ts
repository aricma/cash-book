import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup, select, fillInput, makeSetDatePicker } from '../utils';

test.describe('Book entry edge cases', () => {
	test('shows no templates state when only accounts exist', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries/create');
		await expect(page.getByText('No Templates', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Transactions', exact: true }).first()).toBeVisible();
	});

	test('shows no selected template state when templates exist but none is selected', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries/create');
		await expect(page.getByText('No Selected Template', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Set Template', exact: true })).toBeVisible();
	});

	test('selecting a template opens the create-book-entry form', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries/create');
		await select(page)('Set Template', 'Nikolassee');
		await expect(page.getByText('New Book Entry', { exact: true })).toBeVisible();
		await expect(page.locator('.input-group', { hasText: 'Cash Station: Start Value' }).locator('input')).toBeVisible();
	});

	test('duplicate date requires confirmation before overriding an existing entry', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries/create');
		await select(page)('Set Template', 'Nikolassee');
		await makeSetDatePicker(page)('2022', 'Januar', '2');
		await fillInput(page)('Cash Station: Start Value', '100');
		await fillInput(page)('7%', '100');
		await fillInput(page)('Master', '50');
		await fillInput(page)('Tagesabrechnung', '50');
		await fillInput(page)('Cash Station: End Value', '100');

		await page.getByRole('button', { name: 'Submit', exact: true }).click();
		await expect(page.getByText('Date already exists!', { exact: true })).toBeVisible();
		await expect(page.getByText(/Do you really want to override this date\?/)).toBeVisible();

		await page.getByRole('button', { name: 'No', exact: true }).click();
		await expect(page.getByText('Date already exists!', { exact: true })).toBeHidden();
		await expect(page).toHaveURL(PAGE_URL + '/book-entries/create');

		await page.getByRole('button', { name: 'Submit', exact: true }).click();
		await page.getByRole('button', { name: 'Yes', exact: true }).click();
		await expect(page).toHaveURL(PAGE_URL + '/book-entries');
	});
});
