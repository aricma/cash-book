import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { makeCreateAccount } from '../utils';

test.beforeEach(async ({ page }) => {
	await page.goto(PAGE_URL + '/accounts');
	await makeCreateAccount(page)('Difference', 'Difference Account', '3400');
});

test.describe('Accounts', () => {
	test('create account', async ({ page }) => {
		await expect(page.locator('[data-test-id="account"] >> "Difference"')).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> "Difference Account"')).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> "3400"')).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> button >> "Edit"')).toBeVisible();
	});

	test('edit account', async ({ page }) => {
		await page.locator('[data-test-id="account"] >> button >> "Edit"').click();

		await page.locator('button >> "Difference"').click();
		await page.locator(`"Cashier"`).click();

		const nameInput = await page.locator('input:near(label:text("Name"), 5)');
		await nameInput.fill('Cash Station 001');

		const numberInput = await page.locator('input:near(label:text("Number"), 5)');
		await numberInput.fill('1000');

		await page.locator('button >> "Submit"').click();

		await expect(page.locator('[data-test-id="account"] >> "Cashier"')).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> "Cash Station 001"')).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> "1000"')).toBeVisible();
	});
});
