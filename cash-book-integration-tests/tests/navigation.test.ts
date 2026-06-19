import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup } from '../utils';

test.describe('Navigation states', () => {
	test('no accounts shows accounts settings support only', async ({ page }) => {
		await page.goto(PAGE_URL + '/accounts');
		await expect(page.getByRole('button', { name: 'Accounts', exact: true }).last()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Settings', exact: true }).last()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Support', exact: true }).last()).toBeVisible();
		await expect(page.getByRole('button', { name: 'Transactions', exact: true })).toHaveCount(0);
	});

	test('accounts without templates shows transactions entry point', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/transactions');
		await expect(page.getByRole('button', { name: 'Transactions', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Support', exact: true })).toBeVisible();
	});

	test('templates without entries shows create book entry button and support', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries/create');
		await expect(page.getByRole('button', { name: 'Create Book Entry', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Support', exact: true })).toBeVisible();
	});

	test('full data state shows entries instead of support', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');
		await page.goto(PAGE_URL + '/book-entries');
		await expect(page.getByRole('button', { name: 'Entries', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Support', exact: true })).toHaveCount(0);
	});
});
