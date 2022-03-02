import { test, expect } from '@playwright/test';
import { sleep } from '../utils';
import { PAGE_URL } from '../environment';

test.describe('Home Page', () => {
	test('shows home page and redirects after 2sec', async ({ page }) => {
		await page.goto(PAGE_URL);
		await expect(page.locator('svg >> title')).toContainText('cash book icon');
		await expect(page.locator('h1')).toContainText('cash');
		await expect(page.locator('h1')).toContainText('Book');

		await sleep(2000);

		await expect(page).toHaveURL(PAGE_URL + '/accounts');
	});
});
