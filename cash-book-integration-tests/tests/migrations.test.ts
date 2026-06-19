import { test } from '@playwright/test';
import { expectJsonFilesToBeEqual, upload, download } from '../utils';
import { PAGE_URL } from '../environment';

test.describe('Migrations', () => {
	test('v3 -> v3.1', async ({ page }) => {
		await page.goto(PAGE_URL + '/settings');
		page.on('dialog', (dialog) => dialog.accept());
		await upload(page)(['./fixtures/backup-v3.json'])(page.getByRole('button', { name: 'Load Backup', exact: true }));
		const path = await download(page)(page.getByRole('button', { name: 'Download Backup', exact: true }));
		expectJsonFilesToBeEqual(path, './fixtures/backup-v3_1.json');
	});
});
