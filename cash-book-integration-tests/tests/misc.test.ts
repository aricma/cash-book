import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { sleep } from '../utils';

test.describe('MISC', () => {
	test.describe('support link', () => {
		test('given no accounts, then support link is at the bottom right menu item', async ({ page, context }) => {
			await page.goto(PAGE_URL);
			await sleep(2000);

			const [newPage] = await Promise.all([context.waitForEvent('page'), page.locator('button >> "Support"').click()]);
			await newPage.waitForLoadState();

			await expect(newPage).toHaveURL('https://aricma.gitbook.io/cashbook/support/faq');
		});
	});
});
