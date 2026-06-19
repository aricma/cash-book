import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup, makeCreateTemplate, makeFindInput } from '../utils';

test.describe('Transactions', () => {
	test('create template', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');

		await page.goto(PAGE_URL + '/transactions');

		await makeCreateTemplate(page)({
			name: 'Some Template',
			cashierAccount: 'Nikolassee',
			transactions: [
				['7%', true, 'Ware'],
				['Amex', false, 'Karte'],
				['Bank', false, 'Bank'],
			],
		});

		const numberOfTransactions = await page.locator('[data-test-id="transaction"]').count();
		expect(numberOfTransactions).toBe(3);
	});

	test('edit template', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');

		await page.goto(PAGE_URL + '/transactions');

		await page.getByRole('button', { name: 'Edit Template', exact: true }).first().click();
		await expect(page.getByRole('heading', { name: 'Create Transaction Template', exact: true })).toBeVisible();
		await page.locator('#create-template-modal-content').evaluate((node) => node.scroll(0, 0));

		const input = await makeFindInput(page)('Name', 0);
		await input.fill('CHANGED TEMPLATE NAME');

		await page.getByRole('button', { name: 'Submit', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'Create Transaction Template', exact: true })).toBeHidden();

		await expect(page.getByText('CHANGED TEMPLATE NAME', { exact: true })).toBeVisible();
		const numberOfTransactions = await page.locator('[data-test-id="transaction"]').count();
		expect(numberOfTransactions).toBe(34);
	});

	test('create template can add remove reorder and toggle transaction rows', async ({ page }) => {
		await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
		await page.goto(PAGE_URL + '/transactions');
		await page.getByRole('button', { name: 'Create', exact: true }).first().click();

		await page.locator('.input-group', { hasText: 'Name' }).locator('input').first().fill('Complex Template');
		await page.getByRole('button', { name: 'set cashier account', exact: true }).click();
		await page.getByRole('option', { name: 'Nikolassee', exact: true }).click();
		await expect(page.getByRole('button', { name: 'Kassendifferenz', exact: true })).toBeVisible();

		await page.getByRole('button', { name: 'Add Transaction', exact: true }).first().click();
		await page.getByRole('button', { name: 'Add Transaction', exact: true }).first().click();

		await page.locator('.input-group', { hasText: 'Name' }).locator('input').nth(1).fill('First');
		await page.locator('.input-group', { hasText: 'Name' }).locator('input').nth(2).fill('Second');

		await page.getByRole('button', { name: 'set other account', exact: true }).first().click();
		await page.getByRole('option', { name: 'Ware', exact: true }).click();
		await page.getByRole('button', { name: 'set other account', exact: true }).first().click();
		await page.getByRole('option', { name: 'Bank', exact: true }).click();

		await page.getByRole('button', { name: 'Set transaction type', exact: true }).first().click();
		await page.getByRole('button', { name: 'Increase Order', exact: true }).first().click();
		await page.getByRole('button', { name: 'Remove', exact: true }).nth(1).click();

		await expect(page.locator('.input-group', { hasText: 'Name' }).locator('input').last()).toHaveValue('Second');
		await expect(page.getByRole('button', { name: 'Remove', exact: true })).toHaveCount(1);
	});
});
