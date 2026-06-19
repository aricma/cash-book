import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { makeCreateAccount } from '../utils';

test.describe('Accounts validation', () => {
	test('shows validation when name is missing', async ({ page }) => {
		await page.goto(PAGE_URL + '/accounts');
		await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
		await page.getByPlaceholder('e.g. 1500').fill('1500');
		await page.getByRole('button', { name: 'Validate', exact: true }).click();
		await expect(page.getByText('Name is missing!', { exact: true })).toBeVisible();
	});

	test('shows validation when number is not four digits', async ({ page }) => {
		await page.goto(PAGE_URL + '/accounts');
		await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
		await page.getByPlaceholder('e.g. Bank').fill('Bank');
		await page.getByPlaceholder('e.g. 1500').fill('150');
		await page.getByRole('button', { name: 'Validate', exact: true }).click();
		await expect(page.getByText('Account number is not a 4 digit number!', { exact: true })).toBeVisible();
	});

	test('shows validation when number is already taken', async ({ page }) => {
		await page.goto(PAGE_URL + '/accounts');
		await makeCreateAccount(page)('Default', 'Bank', '1500');
		await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
		await page.getByPlaceholder('e.g. Bank').fill('Cash');
		await page.getByPlaceholder('e.g. 1500').fill('1500');
		await page.getByRole('button', { name: 'Validate', exact: true }).click();
		await expect(page.getByText('Account is already taken by "Bank"!', { exact: true })).toBeVisible();
	});
});
