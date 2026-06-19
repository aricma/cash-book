import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';

test.describe('MISC', () => {
	test.describe('support link', () => {
		test('given no accounts, then support link is at the bottom right menu item', async ({ page, context }) => {
			await page.goto(PAGE_URL);
			await expect(page).toHaveURL(PAGE_URL + '/accounts', { timeout: 4000 });

			const [newPage] = await Promise.all([
				context.waitForEvent('page'),
				page.getByRole('button', { name: 'Support', exact: true }).click(),
			]);
			await newPage.waitForLoadState();

			await expect(newPage).toHaveURL('https://aricma.gitbook.io/cashbook/support/faq');
		});
	});
});
