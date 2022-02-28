import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup, makeCreateTemplate, select, asyncForEach, fillInput, makeFindInput } from '../utils';

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

		await page.locator('button >> "Edit Template"').nth(0).click();
		await page.locator('h2 >> "Create Transaction Template"').isVisible();
		await page.locator('#create-template-modal-content').evaluate((node) => node.scroll(0, 0));

		const input = await makeFindInput(page)('Name');
		await input.fill('CHANGED TEMPLATE NAME');

		await page.locator('button >> "Submit"').click();
		await page.locator('h2 >> "Create Transaction Template"').isHidden();

		await expect(page.locator('"CHANGED TEMPLATE NAME"')).toBeVisible();
		const numberOfTransactions = await page.locator('[data-test-id="transaction"]').count();
		expect(numberOfTransactions).toBe(34);
	});
});
