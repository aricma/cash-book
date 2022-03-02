import { test, expect } from '@playwright/test';
import { select, sleep, uploadBackup } from '../utils';
import { PAGE_URL } from '../environment';

test.describe('Backup', () => {
	test('upload and download backup', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL + '/book-entries');

		await select(page)('Set Template', 'Nikolassee');
		await expect(page.locator('#difference-account-aggregation >> "-30.73"')).toBeVisible();
	});

	test('download backup reset and upload', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-v3_1.json');

		await page.goto(PAGE_URL);
		await sleep(2000);
		await expect(page).toHaveURL(PAGE_URL + '/book-entries/create');

		await page.goto(PAGE_URL + '/settings');
		await page.locator('button >> "Reset"').click();

		await expect(page).toHaveURL(PAGE_URL + '/accounts');
	});

	test('upload invalid backup', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-invalid-v3_1.json');
		await expect(page.locator('"Failed To Read/Validate The Backup"')).toBeVisible();
		await expect(page.locator('button >> "Reset"')).toBeVisible();
		await expect(page.locator('button >> "Download Backup"')).toBeVisible();
		await expect(page.locator('button >> "Reload"')).toBeVisible();
	});
});
