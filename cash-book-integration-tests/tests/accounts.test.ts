import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { makeCreateAccount, uploadBackup } from '../utils';

test.describe('Accounts', () => {
	test('create account', async ({ page }) => {
		await page.goto(PAGE_URL + '/accounts');
		await makeCreateAccount(page)('Difference', 'Difference Account', '3400');

		await expect(page.getByText('Difference', { exact: true })).toBeVisible();
		await expect(page.locator('[data-test-id="account"] >> text="Difference Account"')).toBeVisible();
		await expect(page.getByText('3400', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
	});

	test('edit account', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/accounts');
		await page.locator('[data-test-id="account"]:has-text("Kassendifferenz")').getByRole('button', { name: 'Edit', exact: true }).click();

		await page.getByRole('button', { name: 'Difference', exact: true }).click();
		await page.getByRole('option', { name: 'Cashier', exact: true }).click();

		const nameInput = page.getByPlaceholder('e.g. Bank');
		await nameInput.fill('Cash Station 001');
		await expect(nameInput).toHaveValue('Cash Station 001');

		const numberInput = page.getByPlaceholder('e.g. 1500');
		await numberInput.fill('7000');
		await expect(numberInput).toHaveValue('7000');

		await page.getByRole('button', { name: 'Submit', exact: true }).click();

		const editedAccount = page.locator('[data-test-id="account"]:has-text("Cash Station 001")');
		await expect(editedAccount.getByText('Cashier', { exact: true })).toBeVisible();
		await expect(editedAccount.getByText('Cash Station 001', { exact: true })).toBeVisible();
		await expect(editedAccount.getByText('7000', { exact: true })).toBeVisible();
	});
});
