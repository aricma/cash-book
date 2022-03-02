import { Page, expect, Locator } from '@playwright/test';
import { PAGE_URL } from './environment';
import * as fs from 'fs';
import * as Path from 'path';

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

interface CreateTemplateRequest {
	name: string;
	cashierAccount?: string;
	differenceAccount?: string;
	transactions: Array<[name: string, type: boolean, account: string]>;
}

export const makeCreateTemplate = (page: Page) => async (request: CreateTemplateRequest) => {
	await page.locator('button >> "Transactions"').click();
	await page.waitForURL(PAGE_URL + '/transactions');

	await page.locator('button >> "Create"').nth(0).click();
	await page.locator('h2 >> "Create Transaction Template"').isVisible();

	await fillInput(page)('Name', request.name);

	request.cashierAccount && (await select(page)('set cashier account', request.cashierAccount));
	// (request.differenceAccount) && await select(page)("???", request.differenceAccount);

	await asyncForEach(async ([name, type, account], i) => {
		await page.locator('#create-template-modal-content').evaluate((node) => node.scroll(0, 0));
		const addTransactionButton = await page.locator('#modals >> button >> "Add Transaction"').nth(0);
		await addTransactionButton.click();

		const nameInput = await page.locator('input:near(label:text("Name"), 5)').nth(i + 1);
		await nameInput.fill(name);

		if (type) {
			await page.locator('button >> "Set transaction type"').nth(i).click();
		}

		await page
			.locator('[data-test-id="create-transaction-select-other-account"] >> button >> "set other account"')
			.click();
		await page.locator(`"${account}"`).click();
	})(request.transactions);

	await page.locator('button >> "Submit"').click();

	await page.locator('h2 >> "Create Transaction Template"').isHidden();
};

interface CreateBookEntryRequest {
	date: [year: string, month: string, day: string];
	start?: string;
	transactions: Array<[string, string | null]>;
	end?: string;
}

export const makeCreateBookEntry = (page: Page) => async (request: CreateBookEntryRequest) => {
	await page.locator('button >> "Create Book Entry"').click();
	await page.waitForURL(PAGE_URL + '/book-entries/create');

	await makeSetDatePicker(page)(...request.date);

	await fillInput(page)('Cash Station: Start Value', request.start || "0");
	await asyncForEach<[string, string | null]>(async ([label, value]) => {
		if (value === null) return;
	 	await fillInput(page)(label, value);
	})(request.transactions);
	await fillInput(page)('Cash Station: End Value', request.end);

	const diffTransactionDiv = await page.locator('#difference-account-message-id');
	const needsDiffTransaction = await diffTransactionDiv.isVisible();
	if (needsDiffTransaction) {
		await diffTransactionDiv.locator('input[type="checkbox"]').click();
	}

	await page.locator('button >> "Submit"').click();
};

export const makeSetDatePicker = (page: Page) => async (year: string, month: string, day: string) => {
	await expect(page.locator('[data-test-id="create-book-entry-date-picker"]')).toBeVisible();
	while (true) {
		const hasCorrectYear = await page.locator(`[data-test-id="create-book-entry-date-picker"] >> "${month}"`).isVisible();
		if (hasCorrectYear) break;
		await page.locator('[data-test-id="create-book-entry-date-picker"] >> "Nächster Monat"').click();
	}
	while (true) {
		const hasCorrectYear = await page.locator(`[data-test-id="create-book-entry-date-picker"] >> "${year}"`).isVisible();
		if (hasCorrectYear) break;
		await page.locator('[data-test-id="create-book-entry-date-picker"] >> "Vorheriges Jahr"').click();
	}
	await page.locator(`button:not([disabled=""]) >> "${day}"`).nth(0).click();
};

export const expectFilesToBeEqual = (pathToFile: string, pathToExpectedFile: string) => {
	const fileContent = readFile(pathToFile);
	const expectedFileContent = readFile(pathToExpectedFile);
	expect(fileContent).toEqual(expectedFileContent);
}

export const select = (page: Page) => async (select: string, option: string) => {
	await page.locator(`button >> "${select}"`).click();
	await page.locator(`"${option}"`).click();
	await page.locator(`button >> "${option}"`).isVisible();
};

export const fillInput = (page: Page) => async (label: string, value: string): Promise<Locator> => {
	const input = await makeFindInput(page)(label);
	await input.fill(value);
	await expect(input).toHaveValue(value);
	return input;
};

export const makeFindInput =
	(page: Page) =>
	async (label: string, nth?: number): Promise<Locator> => {
		return page.locator(`input:near(label:text("${label}"), 5)`).nth(nth || 0);
	};

export const download =
	(page: Page) =>
	async (locator: Locator): Promise<string> => {
		const [download] = await Promise.all([page.waitForEvent('download'), locator.click()]);
		return await download.path();
	};

export const upload = (page: Page) => (files: Array<string>) => async (locator: Locator) => {
	const absoluteFilePaths = files.map(toAbsoluteFilePath);
	await Promise.all([
		// https://github.com/microsoft/playwright/pull/5467/files
		page.waitForEvent('filechooser').then((fileChooser) => fileChooser.setFiles(absoluteFilePaths)),
		locator.click(),
	]);
};

export const asyncForEach =
	<T>(fn: (x: T, index: number) => Promise<void>) =>
	async (list: Array<T>): Promise<void> => {
		for (let i = 0; i < list.length; i++) {
			await fn(list[i], i);
		}
	};

export const readFile = (path: string) => fs.readFileSync(toAbsoluteFilePath(path), { encoding: 'utf8' });

export const toAbsoluteFilePath = (path: string): string => (Path.isAbsolute(path) ? path : Path.join(__dirname, path));

export const uploadBackup = (page: Page) => async (path: string) => {
	await page.goto(PAGE_URL + '/settings');
	page.on('dialog', (dialog) => dialog.accept());
	await upload(page)([path])(page.locator('button >> "Load Backup"'));
};
