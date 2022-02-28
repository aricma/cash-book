import { test, expect } from '@playwright/test';
import { readFile, upload, download } from '../utils';
import { PAGE_URL } from '../environment';

test.beforeEach(async ({ page }) => {
	await page.goto(PAGE_URL + '/settings');
});

test.describe('Migrations', () => {
	test('v3 -> v3.1', async ({ page }) => {
		page.on('dialog', (dialog) => dialog.accept());
		await upload(page)(['./fixtures/backup-v3.json'])(page.locator('button >> "Load Backup"'));
		const path = await download(page)(page.locator('button >> "Download Backup"'));
		const backupV3_1 = readFile(path);
		const expectedBackup = readFile('./fixtures/backup-v3_1.json');
		expect(backupV3_1).toEqual(expectedBackup);
	});
});
