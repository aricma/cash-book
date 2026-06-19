import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup } from '../utils';

test.describe('Transactions validation', () => {
	test('requires name and cashier account before submit', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/transactions');
		await page.getByRole('button', { name: 'Create', exact: true }).first().click();

		await expect(page.getByText('Name is missing!', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'set cashier account', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Kassendifferenz', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Validate', exact: true })).toBeDisabled();
	});

	test('requires each transaction row to have a name and other account', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/transactions');
		await page.getByRole('button', { name: 'Create', exact: true }).first().click();

		await page.locator('.input-group', { hasText: 'Name' }).locator('input').first().fill('Some Template');
		await page.getByRole('button', { name: 'set cashier account', exact: true }).click();
		await page.getByRole('option', { name: 'Nikolassee', exact: true }).click();
		await page.getByRole('button', { name: 'Add Transaction', exact: true }).click();

		await expect(page.getByText('Name is missing!', { exact: true })).toBeVisible();
		await expect(page.getByText('Account is missing!', { exact: true })).toBeVisible();
	});
});
