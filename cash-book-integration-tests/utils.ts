import { Page, expect, Locator } from '@playwright/test';
import { PAGE_URL } from './environment';
import * as fs from 'fs';
import * as Path from 'path';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const modalInputByLabel = (page: Page, label: string) =>
	page.locator('#modals').locator('.input-group', { hasText: label }).locator('input').first();

const selectOption =
	(page: Page) =>
	async (selectLabel: string, option: string): Promise<void> => {
		const button = page.getByRole('button', { name: selectLabel, exact: true }).last();
		await button.click();

		const options = page.getByRole('option');
		await expect(options.first()).toBeVisible();
		const optionTitles = (await options.allTextContents()).map((value) => value.trim());
		const optionIndex = optionTitles.indexOf(option);
		if (optionIndex < 0) throw Error(`Option not found: ${option}`);

		await page.keyboard.press('Home');
		for (let i = 0; i < optionIndex; i++) {
			await page.keyboard.press('ArrowDown');
		}
		await page.keyboard.press('Enter');
		await expect(page.getByRole('button', { name: option, exact: true }).last()).toBeVisible();
	};

export const makeCreateAccount = (page: Page) => async (type: string, name: string, number: string) => {
	await page.waitForURL(PAGE_URL + '/accounts');

	await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
	await expect(page.getByRole('heading', { name: 'Create Account', exact: true })).toBeVisible();

	if (type !== 'Default') {
		await selectOption(page)('Default', type);
	}

	const nameInput = modalInputByLabel(page, 'Name');
	await nameInput.fill(name);
	await expect(nameInput).toHaveValue(name);

	const numberInput = modalInputByLabel(page, 'Number');
	await numberInput.fill(number);
	await expect(numberInput).toHaveValue(number);

	await page.getByRole('button', { name: 'Submit', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Create Account', exact: true })).toBeHidden();
};

interface CreateTemplateRequest {
	name: string;
	cashierAccount?: string;
	differenceAccount?: string;
	transactions: Array<[name: string, type: boolean, account: string]>;
}

export const makeCreateTemplate = (page: Page) => async (request: CreateTemplateRequest) => {
	await page.getByRole('button', { name: 'Transactions', exact: true }).click();
	await page.waitForURL(PAGE_URL + '/transactions');

	await page.getByRole('button', { name: 'Create', exact: true }).first().click();
	await expect(page.getByRole('heading', { name: 'Create Transaction Template', exact: true })).toBeVisible();

	await fillInput(page)('Name', request.name);

	request.cashierAccount && (await select(page)('set cashier account', request.cashierAccount));
	request.differenceAccount && (await select(page)('set difference account', request.differenceAccount));

	await asyncForEach(async ([name, type, account], i) => {
		await page.locator('#create-template-modal-content').evaluate((node) => node.scroll(0, 0));
		await page.getByRole('button', { name: 'Add Transaction', exact: true }).first().click();

		const nameInput = await makeFindInput(page)('Name', i + 1);
		await nameInput.fill(name);

		if (type) {
			await page.getByRole('button', { name: 'Set transaction type', exact: true }).nth(i).click();
		}

		await page.getByRole('button', { name: 'set other account', exact: true }).click();
		await page.getByRole('option', { name: account, exact: true }).click();
	})(request.transactions);

	await page.getByRole('button', { name: 'Submit', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Create Transaction Template', exact: true })).toBeHidden();
};

interface CreateBookEntryRequest {
	date: [year: string, month: string, day: string];
	start?: string;
	transactions: Array<[string, string | null]>;
	end?: string;
}

export const makeCreateBookEntry = (page: Page) => async (request: CreateBookEntryRequest) => {
	await page.getByRole('button', { name: 'Create Book Entry', exact: true }).click();
	await page.waitForURL(PAGE_URL + '/book-entries/create');

	await makeSetDatePicker(page)(...request.date);

	await fillInput(page)('Cash Station: Start Value', request.start || '0');
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

	await page.getByRole('button', { name: 'Submit', exact: true }).click();
};

export const makeSetDatePicker = (page: Page) => async (year: string, month: string, day: string) => {
	await expect(page.locator('[data-test-id="create-book-entry-date-picker"]')).toBeVisible();
	while (true) {
		const hasCorrectYear = await page
			.locator(`[data-test-id="create-book-entry-date-picker"] >> "${month}"`)
			.isVisible();
		if (hasCorrectYear) break;
		await page.locator('[data-test-id="create-book-entry-date-picker"] >> "Nächster Monat"').click();
	}
	while (true) {
		const hasCorrectYear = await page
			.locator(`[data-test-id="create-book-entry-date-picker"] >> "${year}"`)
			.isVisible();
		if (hasCorrectYear) break;
		await page.locator('[data-test-id="create-book-entry-date-picker"] >> "Vorheriges Jahr"').click();
	}
	await page.locator(`button:not([disabled=""]) >> "${day}"`).nth(0).click();
};

export const expectFilesToBeEqual = (pathToFile: string, pathToExpectedFile: string) => {
	const fileContent = readFile(pathToFile);
	const expectedFileContent = readFile(pathToExpectedFile);
	expect(fileContent).toEqual(expectedFileContent);
};

export const expectCsvFilesToBeEqualIgnoringRowOrder = (pathToFile: string, pathToExpectedFile: string) => {
	const normalize = (content: string) => {
		const [header, ...rows] = content.trim().split('\n');
		return [header, ...rows.sort()].join('\n');
	};

	const fileContent = normalize(readFile(pathToFile));
	const expectedFileContent = normalize(readFile(pathToExpectedFile));
	expect(fileContent).toEqual(expectedFileContent);
};

export const expectJsonFilesToBeEqual = (pathToFile: string, pathToExpectedFile: string) => {
	const actual = JSON.parse(readFile(pathToFile));
	const expected = JSON.parse(readFile(pathToExpectedFile));
	expect(actual).toEqual(expected);
};

export const select = (page: Page) => async (select: string, option: string) => {
	await selectOption(page)(select, option);
};

export const fillInput =
	(page: Page) =>
	async (label: string, value: string): Promise<Locator> => {
		const input = await makeFindInput(page)(label);
		await input.fill(value);
		await expect(input).toHaveValue(value);
		return input;
	};

export const makeFindInput =
	(page: Page) =>
	async (label: string, nth = 0): Promise<Locator> => {
		const locator = page.locator('.input-group', { hasText: label }).locator('input');
		return nth < 0 ? locator.last() : locator.nth(nth);
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
	await upload(page)([path])(page.getByRole('button', { name: 'Load Backup', exact: true }));
	await page.waitForFunction(
		(key) => {
			const value = window.localStorage.getItem(key);
			return typeof value === 'string' && value.length > 0;
		},
		'ARICMA_CASHIER'
	);
};
