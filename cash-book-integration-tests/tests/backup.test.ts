import { test, expect } from '@playwright/test';
import { select, uploadBackup, download, expectJsonFilesToBeEqual } from '../utils';
import { PAGE_URL } from '../environment';

test.describe('Backup', () => {
	test('upload and download backup', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');

		await select(page)('Set Template', 'Nikolassee');
		await expect(page.locator('#difference-account-aggregation >> "-30.73"')).toBeVisible();
	});

	test('upload and download backup round-trips the same data', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');
		await page.goto(PAGE_URL + '/settings');
		const path = await download(page)(page.getByRole('button', { name: 'Download Backup', exact: true }));
		expectJsonFilesToBeEqual(path, './fixtures/backup-v3_1.json');
	});

	test('download backup reset and upload', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL);
		await expect(page).toHaveURL(PAGE_URL + '/book-entries/create', { timeout: 4000 });

		await page.goto(PAGE_URL + '/settings');
		await page.getByRole('button', { name: 'Reset', exact: true }).click();

		await expect(page).toHaveURL(PAGE_URL + '/accounts');
	});

	test('upload invalid backup', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-v3_1.json');
		await expect(page.getByText('Failed To Read/Validate The Backup', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Download Backup', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reload', exact: true })).toBeVisible();
	});

	test('invalid backup screen can recover via reset', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-v3_1.json');
		await expect(page.getByText('Failed To Read/Validate The Backup', { exact: true })).toBeVisible();

		await page.getByRole('button', { name: 'Reset', exact: true }).click();
		await expect(page).toHaveURL(PAGE_URL + '/accounts', { timeout: 4000 });
	});
});
