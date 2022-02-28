import { test, expect } from '@playwright/test';
import { upload, select, toAbsoluteFilePath, sleep } from '../utils';
import { PAGE_URL } from '../environment';

test.describe('Backup', () => {
	test('upload backup', async ({ page }) => {
		await page.goto(PAGE_URL + '/settings');
		page.on('dialog', (dialog) => dialog.accept());
		await upload(page)(['./fixtures/backup-v3_1.json'])(page.locator('button >> "Load Backup"'));

		await page.goto(PAGE_URL + '/book-entries');

		await select(page)('Set Template', 'Nikolassee');
		await expect(page.locator('#difference-account-aggregation >> "-30.73"')).toBeVisible();
	});
	test.fixme('download backup', () => {});
	test.fixme('download backup reset and upload', () => {});
	test.fixme('upload change and download', () => {});

	test.fixme('upload invalid backup', () => {});
});
