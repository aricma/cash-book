import { Page, expect, Locator } from '@playwright/test';
import { PAGE_URL } from './environment';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const makeCreateAccount = (page: Page) => async (type: string, name: string, number: string) => {
	await page.waitForURL(PAGE_URL + '/accounts');

	await page.locator('button >> "Create Account"').nth(0).click();

	await page.locator('h2 >> "Create Account"').isVisible();

	if (type !== 'Default') {
		await page.locator('button >> "Default"').click();
		await page.locator(`"${type}"`).click();
		await page.locator(`button >> "${type}"`).isVisible();
	}

	const nameInput = await page.locator('input:near(label:text("Name"), 5)');
	await nameInput.fill(name);
	await expect(nameInput).toHaveValue(name);

	const numberInput = await page.locator('input:near(label:text("Number"), 5)');
	await numberInput.fill(number);
	await expect(numberInput).toHaveValue(number);

	await page.locator('button >> "Submit"').click();

	await page.locator('h2 >> "Create Account"').isHidden();
};

export const makeCreateTemplate =
	(page: Page) => async (name: string, transactions: Array<[name: string, type: boolean, account: string]>) => {
		await page.locator('button >> "Transactions"').click();
		await page.waitForURL(PAGE_URL + '/transactions');

		await page.locator('button >> "Create"').nth(0).click();
		await page.locator('h2 >> "Create Transaction Template"').isVisible();

		const nameInput = await page.locator('input:near(label:text("Name"), 5)');
		await nameInput.fill(name);
		await expect(nameInput).toHaveValue(name);

		await asyncForEach(async ([name, type, account], i) => {
			await page.locator('#create-template-modal-content').evaluate((node) => node.scroll(0, 0));
			const addTransactionButton = await page.locator('#modals >> button >> "Add Transaction"').nth(0);
			await addTransactionButton.click();

			const nameInput = await page.locator('input:near(label:text("Name"), 5)').nth(i + 1);
			await nameInput.fill(name);
			await expect(nameInput).toHaveValue(name);

			if (type) {
				await page.locator('button >> "Set transaction type"').click();
			}

			await page.locator('button >> "set other account"').click();
			await page.locator(`"${account}"`).click();
			await page.locator(`button >> "${account}"`).isVisible();
		})(transactions);

		await page.locator('button >> "Submit"').click();

		await page.locator('h2 >> "Create Transaction Template"').isHidden();
	};
export const makeBookEntry =
	(page: Page) => async (bookEntry: [string, string, string | null, string | null, string | null, string]) => {
		await page.locator('button >> "Create Book Entry"').click();
		await page.waitForURL(PAGE_URL + '/book-entries/create');

		const [day, start, income, expense, bank, end] = bookEntry;

		await page.locator(`button >> "${day}"`).nth(0).click();
		start !== null && (await fillInput(page)('Cash Station: Start Value', start));
		income !== null && (await fillInput(page)('In', income));
		expense !== null && (await fillInput(page)('Out', expense));
		bank !== null && (await fillInput(page)('Bank', bank));
		await fillInput(page)('Cash Station: End Value', end);

		const diffTransactionDiv = await page.locator('#difference-account-message-id');
		const needsDiffTransaction = await diffTransactionDiv.isVisible();
		if (needsDiffTransaction) {
			await diffTransactionDiv.locator('input[type="checkbox"]').click();
		}

		await page.locator('button >> "Submit"').click();
	};

const fillInput = (page: Page) => async (label: string, value: string) => {
	const input = await makeFindInput(page)(label);
	await input.fill(value);
	await expect(input).toHaveValue(value);
};

const makeFindInput =
	(page: Page) =>
	async (label: string): Promise<Locator> => {
		return page.locator(`input:near(label:text("${label}"), 5)`);
	};

export const download =
	(page: Page) =>
	async (locator: Locator): Promise<string> => {
		const [download] = await Promise.all([page.waitForEvent('download'), locator.click()]);
		return await download.path();
	};
export const asyncForEach =
	<T>(fn: (x: T, index: number) => Promise<void>) =>
	async (list: Array<T>): Promise<void> => {
		for (let i = 0; i < list.length; i++) {
			await fn(list[i], i);
		}
	};