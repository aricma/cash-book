# Integration Test Stabilization and Gap Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Playwright integration suite reliable again, then expand it to cover the highest-risk missing user flows around validation, routing, backups, and book-entry edge cases.

**Architecture:** First fix the harness problems that currently invalidate many scenarios: mixed origins (`localhost` vs `127.0.0.1`), overwritten Playwright `use` config, async backup upload races, and brittle selectors. Once the suite is deterministic, rebaseline the existing happy-path and export assertions, then add focused tests for the uncovered states already visible in the app code.

**Tech Stack:** Playwright, TypeScript, Vite dev server, React, localStorage-backed app state

---

### Task 1: Stabilize the Playwright harness and backup upload flow

**Files:**

- Modify: `cash-book-integration-tests/playwright.config.ts`
- Modify: `cash-book-integration-tests/environment.ts`
- Modify: `cash-book-integration-tests/utils.ts`
- Test: `cash-book-integration-tests/tests/setup.test.ts`
- Test: `cash-book-integration-tests/tests/backup.test.ts`

- [ ] **Step 1: Capture the current failing baseline**

Run: `npm --prefix cash-book-integration-tests test -- --grep "given accounts|upload and download backup|create bookEntry without auto difference|create template"`
Expected: multiple failures caused by navigation to `/accounts`, missing `Set Template`, or timeouts after backup upload.

- [ ] **Step 2: Merge the duplicate Playwright `use` blocks into one effective config**

Replace the two `use` blocks in `cash-book-integration-tests/playwright.config.ts` with one block:

```ts
use: {
  actionTimeout: 0,
  trace: 'on-first-retry',
  baseURL: 'http://127.0.0.1:3000',
},
```

Keep `webServer.url` at `http://127.0.0.1:3000` so the runner and the app share the same origin.

- [ ] **Step 3: Align the test environment constant with the configured origin**

Replace `cash-book-integration-tests/environment.ts` with:

```ts
export const PAGE_URL = 'http://127.0.0.1:3000';
```

- [ ] **Step 4: Make backup upload wait for localStorage to be populated before returning**

Replace the current upload helper block in `cash-book-integration-tests/utils.ts` with:

```ts
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
```

This intentionally waits on the app’s real persistence boundary instead of sleeping.

- [ ] **Step 5: Verify the harness fix against the scenarios that currently fail because of upload races**

Run: `npm --prefix cash-book-integration-tests test -- --grep "given accounts|upload and download backup"`
Expected: those scenarios no longer fall back to `/accounts` because the uploaded backup is present before navigation.

- [ ] **Step 6: Commit the harness stabilization**

```bash
git add cash-book-integration-tests/playwright.config.ts cash-book-integration-tests/environment.ts cash-book-integration-tests/utils.ts
git commit -m "test: stabilize playwright origin and backup upload flow"
```

### Task 2: Replace brittle shared selectors and sleeps with deterministic interactions

**Files:**

- Modify: `cash-book-integration-tests/utils.ts`
- Modify: `cash-book-integration-tests/tests/home.test.ts`
- Modify: `cash-book-integration-tests/tests/accounts.test.ts`
- Modify: `cash-book-integration-tests/tests/transactions.test.ts`
- Modify: `cash-book-integration-tests/tests/bookEntries.test.ts`
- Modify: `cash-book-integration-tests/tests/setup.test.ts`
- Modify: `cash-book-integration-tests/tests/misc.test.ts`

- [ ] **Step 1: Replace broad `near(...)` and text-engine selectors with label/role-based helpers**

Update the shared helper functions in `cash-book-integration-tests/utils.ts` to:

```ts
export const makeFindInput =
  (page: Page) =>
  async (label: string, nth = 0): Promise<Locator> => {
    return page.getByLabel(label, { exact: true }).nth(nth);
  };

export const select = (page: Page) => async (trigger: string, option: string) => {
  await page.getByRole('button', { name: trigger, exact: true }).click();
  await page.getByRole('button', { name: option, exact: true }).click();
  await expect(page.getByRole('button', { name: option, exact: true })).toBeVisible();
};
```

Then route `fillInput()` through the new `makeFindInput()` helper.

- [ ] **Step 2: Scope the account-creation helper to the active modal instead of the entire page**

Replace the `makeCreateAccount()` interaction block with a modal-scoped version:

```ts
export const makeCreateAccount = (page: Page) => async (type: string, name: string, number: string) => {
  await page.waitForURL(PAGE_URL + '/accounts');

  await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Create Account', exact: true })).toBeVisible();

  if (type !== 'Default') {
    await page.getByRole('button', { name: 'Default', exact: true }).click();
    await page.getByRole('button', { name: type, exact: true }).click();
    await expect(page.getByRole('button', { name: type, exact: true })).toBeVisible();
  }

  const nameInput = page.getByLabel('Name', { exact: true }).last();
  await nameInput.fill(name);
  await expect(nameInput).toHaveValue(name);

  const numberInput = page.getByLabel('Number', { exact: true }).last();
  await numberInput.fill(number);
  await expect(numberInput).toHaveValue(number);

  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Create Account', exact: true })).toBeHidden();
};
```

- [ ] **Step 3: Replace fixed sleeps in redirect tests with URL assertions that wait naturally**

Use this pattern in `home.test.ts`, `setup.test.ts`, `backup.test.ts`, and `misc.test.ts`:

```ts
await page.goto(PAGE_URL);
await expect(page).toHaveURL(PAGE_URL + '/accounts', { timeout: 4000 });
```

and for backup-driven redirects:

```ts
await page.goto(PAGE_URL);
await expect(page).toHaveURL(PAGE_URL + '/transactions', { timeout: 4000 });
```

- [ ] **Step 4: Re-run the existing account, transaction, and book-entry tests with the hardened helpers**

Run: `npm --prefix cash-book-integration-tests test -- --grep "Accounts|Transactions|BookEntries|Setup|Home Page|MISC"`
Expected: selector-related failures now point to real behavior mismatches instead of hidden/multiple-element locator issues.

- [ ] **Step 5: Commit the selector cleanup**

```bash
git add cash-book-integration-tests/utils.ts cash-book-integration-tests/tests/home.test.ts cash-book-integration-tests/tests/accounts.test.ts cash-book-integration-tests/tests/transactions.test.ts cash-book-integration-tests/tests/bookEntries.test.ts cash-book-integration-tests/tests/setup.test.ts cash-book-integration-tests/tests/misc.test.ts
git commit -m "test: replace brittle playwright selectors and sleeps"
```

### Task 3: Rebaseline export assertions around semantic equality instead of incidental row order

**Files:**

- Modify: `cash-book-integration-tests/utils.ts`
- Modify: `cash-book-integration-tests/tests/setup.test.ts`
- Modify: `cash-book-integration-tests/tests/backup.test.ts`
- Modify: `cash-book-integration-tests/tests/migrations.test.ts`

- [ ] **Step 1: Add a normalized CSV comparison helper for DATEV exports**

Add this helper to `cash-book-integration-tests/utils.ts`:

```ts
export const expectCsvFilesToBeEqualIgnoringRowOrder = (pathToFile: string, pathToExpectedFile: string) => {
  const normalize = (content: string) => {
    const [header, ...rows] = content.trim().split('\n');
    return [header, ...rows.sort()].join('\n');
  };

  const fileContent = normalize(readFile(pathToFile));
  const expectedFileContent = normalize(readFile(pathToExpectedFile));
  expect(fileContent).toEqual(expectedFileContent);
};
```

Leave the existing exact file helper in place for cases where byte-for-byte equality still matters.

- [ ] **Step 2: Use normalized CSV comparison for the golden-path export**

Update the assertion in `cash-book-integration-tests/tests/setup.test.ts` to:

```ts
const path = await download(page)(page.getByRole('button', { name: 'Export', exact: true }).first());
expectCsvFilesToBeEqualIgnoringRowOrder(path, './fixtures/golden-path-expected-datev-export.csv');
```

- [ ] **Step 3: Add parsed JSON round-trip comparison for downloaded backups**

Add this helper to `cash-book-integration-tests/utils.ts`:

```ts
export const expectJsonFilesToBeEqual = (pathToFile: string, pathToExpectedFile: string) => {
  const actual = JSON.parse(readFile(pathToFile));
  const expected = JSON.parse(readFile(pathToExpectedFile));
  expect(actual).toEqual(expected);
};
```

Then extend `cash-book-integration-tests/tests/backup.test.ts` with a round-trip test:

```ts
test('upload and download backup round-trips the same data', async ({ page }) => {
  await uploadBackup(page)('./fixtures/backup-v3_1.json');
  await page.goto(PAGE_URL + '/settings');
  const path = await download(page)(page.getByRole('button', { name: 'Download Backup', exact: true }));
  expectJsonFilesToBeEqual(path, './fixtures/backup-v3_1.json');
});
```

- [ ] **Step 4: Keep migration verification strict and explicit**

Update `cash-book-integration-tests/tests/migrations.test.ts` to compare parsed JSON objects rather than raw string formatting:

```ts
const path = await download(page)(page.getByRole('button', { name: 'Download Backup', exact: true }));
expectJsonFilesToBeEqual(path, './fixtures/backup-v3_1.json');
```

- [ ] **Step 5: Verify export and migration behavior**

Run: `npm --prefix cash-book-integration-tests test -- --grep "golden path|round-trips the same data|v3 -> v3.1"`
Expected: export and backup assertions fail only on real data regressions, not harmless ordering differences.

- [ ] **Step 6: Commit the assertion rebaseline**

```bash
git add cash-book-integration-tests/utils.ts cash-book-integration-tests/tests/setup.test.ts cash-book-integration-tests/tests/backup.test.ts cash-book-integration-tests/tests/migrations.test.ts
git commit -m "test: normalize export and backup equality assertions"
```

### Task 4: Add account and transaction validation coverage

**Files:**

- Create: `cash-book-integration-tests/tests/accounts.validation.test.ts`
- Create: `cash-book-integration-tests/tests/transactions.validation.test.ts`
- Test references: `cash-book/src/features/accounts/toProps/validation.ts`
- Test references: `cash-book/src/features/transactions/toProps/validation.ts`

- [ ] **Step 1: Add account validation tests for missing fields and duplicate numbers**

Create `cash-book-integration-tests/tests/accounts.validation.test.ts` with:

```ts
import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { makeCreateAccount } from '../utils';

test.describe('Accounts validation', () => {
  test('shows validation when name is missing', async ({ page }) => {
    await page.goto(PAGE_URL + '/accounts');
    await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
    await page.getByLabel('Number', { exact: true }).last().fill('1500');
    await page.getByRole('button', { name: 'Validate', exact: true }).click();
    await expect(page.getByText('Name is missing!')).toBeVisible();
  });

  test('shows validation when number is not four digits', async ({ page }) => {
    await page.goto(PAGE_URL + '/accounts');
    await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
    await page.getByLabel('Name', { exact: true }).last().fill('Bank');
    await page.getByLabel('Number', { exact: true }).last().fill('150');
    await page.getByRole('button', { name: 'Validate', exact: true }).click();
    await expect(page.getByText('Account number is not a 4 digit number!')).toBeVisible();
  });

  test('shows validation when number is already taken', async ({ page }) => {
    await page.goto(PAGE_URL + '/accounts');
    await makeCreateAccount(page)('Default', 'Bank', '1500');
    await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
    await page.getByLabel('Name', { exact: true }).last().fill('Cash');
    await page.getByLabel('Number', { exact: true }).last().fill('1500');
    await page.getByRole('button', { name: 'Validate', exact: true }).click();
    await expect(page.getByText('Account is already taken by "Bank"!')).toBeVisible();
  });
});
```

- [ ] **Step 2: Add transaction-template validation tests for required fields**

Create `cash-book-integration-tests/tests/transactions.validation.test.ts` with:

```ts
import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup } from '../utils';

test.describe('Transactions validation', () => {
  test('requires name, cashier account, and difference account before submit', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
    await page.goto(PAGE_URL + '/transactions');
    await page.getByRole('button', { name: 'Create', exact: true }).first().click();

    await expect(page.getByText('Name is missing!')).toBeVisible();
    await expect(page.getByText('Cashier is missing!')).toBeVisible();
    await expect(page.getByText('Difference account is missing!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Validate', exact: true })).toBeDisabled();
  });

  test('requires each transaction row to have a name and other account', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
    await page.goto(PAGE_URL + '/transactions');
    await page.getByRole('button', { name: 'Create', exact: true }).first().click();

    await page.getByLabel('Name', { exact: true }).first().fill('Some Template');
    await page.getByRole('button', { name: 'set cashier account', exact: true }).click();
    await page.getByRole('button', { name: 'Nikolassee', exact: true }).click();
    await page.getByRole('button', { name: 'set difference account', exact: true }).click();
    await page.getByRole('button', { name: 'Kassendifferenz', exact: true }).click();
    await page.getByRole('button', { name: 'Add Transaction', exact: true }).click();

    await expect(page.getByText('Name is missing!')).toBeVisible();
    await expect(page.getByText('Account is missing!')).toBeVisible();
  });
});
```

- [ ] **Step 3: Verify the new validation coverage**

Run: `npm --prefix cash-book-integration-tests test -- --grep "validation"`
Expected: four new validation tests pass and fail only when the UI or validation messages change.

- [ ] **Step 4: Commit the validation coverage**

```bash
git add cash-book-integration-tests/tests/accounts.validation.test.ts cash-book-integration-tests/tests/transactions.validation.test.ts
git commit -m "test: cover account and transaction validation flows"
```

### Task 5: Add transaction editing and book-entry edge-case coverage

**Files:**

- Modify: `cash-book-integration-tests/tests/transactions.test.ts`
- Create: `cash-book-integration-tests/tests/bookEntries.edge-cases.test.ts`
- Test references: `cash-book/src/features/createBookEntry/toProps/toOverrideDateConfirmationModalViewProps.ts`
- Test references: `cash-book/src/features/bookEntries/toProps/toNoTemplateBookEntriesViewProps.ts`
- Test references: `cash-book/src/features/bookEntries/toProps/toNoTemplatesBookEntriesViewProps.ts`
- Test references: `cash-book/src/features/bookEntries/toProps/toSkeletonBookEntriesViewProps.ts`

- [ ] **Step 1: Extend transaction tests to cover row add/remove/reorder and type toggle**

Append this scenario to `cash-book-integration-tests/tests/transactions.test.ts`:

```ts
test('create template can add remove reorder and toggle transaction rows', async ({ page }) => {
  await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
  await page.goto(PAGE_URL + '/transactions');
  await page.getByRole('button', { name: 'Create', exact: true }).first().click();

  await page.getByLabel('Name', { exact: true }).first().fill('Complex Template');
  await page.getByRole('button', { name: 'set cashier account', exact: true }).click();
  await page.getByRole('button', { name: 'Nikolassee', exact: true }).click();
  await page.getByRole('button', { name: 'set difference account', exact: true }).click();
  await page.getByRole('button', { name: 'Kassendifferenz', exact: true }).click();

  await page.getByRole('button', { name: 'Add Transaction', exact: true }).click();
  await page.getByRole('button', { name: 'Add Transaction', exact: true }).click();

  await page.getByLabel('Name', { exact: true }).nth(1).fill('First');
  await page.getByLabel('Name', { exact: true }).nth(2).fill('Second');

  await page.getByRole('button', { name: 'set other account', exact: true }).nth(0).click();
  await page.getByRole('button', { name: 'Ware', exact: true }).click();
  await page.getByRole('button', { name: 'set other account', exact: true }).nth(1).click();
  await page.getByRole('button', { name: 'Bank', exact: true }).click();

  await page.getByRole('button', { name: 'Set transaction type', exact: true }).nth(0).click();
  await page.getByRole('button', { name: 'Increase Order', exact: true }).nth(0).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).nth(1).click();

  await expect(page.getByText('First')).toBeVisible();
  await expect(page.getByText('Second')).toBeHidden();
});
```

- [ ] **Step 2: Add book-entry empty-state and duplicate-date confirmation coverage**

Create `cash-book-integration-tests/tests/bookEntries.edge-cases.test.ts` with:

```ts
import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup, select, fillInput } from '../utils';

test.describe('Book entry edge cases', () => {
  test('shows no templates state when only accounts exist', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries/create');
    await expect(page.getByText('No Templates')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transactions', exact: true })).toBeVisible();
  });

  test('shows no selected template state when templates exist but none is selected', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries');
    await expect(page.getByText('No Selected Template')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Set Template', exact: true })).toBeVisible();
  });

  test('shows empty selected-template state when template has no entries yet', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries');
    await select(page)('Set Template', 'Nikolassee');
    await expect(page.getByText('Create A Book Entry')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
  });

  test('asks for confirmation before overriding an existing book-entry date', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries/create');
    await select(page)('Set Template', 'Nikolassee');
    await fillInput(page)('Cash Station: Start Value', '100');
    await fillInput(page)('7%', '100');
    await fillInput(page)('Master', '50');
    await fillInput(page)('Tagesabrechnung', '50');
    await fillInput(page)('Cash Station: End Value', '100');
    await page.getByRole('button', { name: 'Submit', exact: true }).click();

    await expect(page.getByText('Date already exists!')).toBeVisible();
    await page.getByRole('button', { name: 'No', exact: true }).click();
    await expect(page.getByText('Date already exists!')).toBeHidden();

    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await page.getByRole('button', { name: 'Yes', exact: true }).click();
    await expect(page).toHaveURL(PAGE_URL + '/book-entries');
  });
});
```

- [ ] **Step 3: Verify the new transaction and book-entry scenarios**

Run: `npm --prefix cash-book-integration-tests test -- --grep "edge cases|add remove reorder|duplicate-date|No Templates|No Selected Template|Create A Book Entry"`
Expected: the suite now covers the previously untested empty states and the duplicate-date override modal.

- [ ] **Step 4: Commit the book-entry and transaction edge coverage**

```bash
git add cash-book-integration-tests/tests/transactions.test.ts cash-book-integration-tests/tests/bookEntries.edge-cases.test.ts
git commit -m "test: cover transaction editing and book-entry edge cases"
```

### Task 6: Add menu-state and recovery-path coverage

**Files:**

- Create: `cash-book-integration-tests/tests/navigation.test.ts`
- Modify: `cash-book-integration-tests/tests/backup.test.ts`
- Test references: `cash-book/src/features/menu/toProps/toMenuViewProps.ts`
- Test references: `cash-book/src/features/settings/toProps.tsx`
- Test references: `cash-book/src/features/application/toProps.ts`

- [ ] **Step 1: Add menu-state assertions for the four major application states**

Create `cash-book-integration-tests/tests/navigation.test.ts` with:

```ts
import { test, expect } from '@playwright/test';
import { PAGE_URL } from '../environment';
import { uploadBackup } from '../utils';

test.describe('Navigation states', () => {
  test('no accounts shows accounts settings support only', async ({ page }) => {
    await page.goto(PAGE_URL + '/accounts');
    await expect(page.getByRole('button', { name: 'Accounts', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Support', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transactions', exact: true })).toHaveCount(0);
  });

  test('accounts without templates shows transactions entry point', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-v3_1.json');
    await page.goto(PAGE_URL + '/transactions');
    await expect(page.getByRole('button', { name: 'Transactions', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Support', exact: true })).toBeVisible();
  });

  test('templates without entries shows create book entry button and support', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-with-accounts-and-transactions-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries/create');
    await expect(page.getByRole('button', { name: 'Create Book Entry', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Support', exact: true })).toBeVisible();
  });

  test('full data state shows entries instead of support', async ({ page }) => {
    await uploadBackup(page)('./fixtures/backup-v3_1.json');
    await page.goto(PAGE_URL + '/book-entries');
    await expect(page.getByRole('button', { name: 'Entries', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Support', exact: true })).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Extend backup recovery coverage beyond passive visibility checks**

Append this scenario to `cash-book-integration-tests/tests/backup.test.ts`:

```ts
test('invalid backup screen can recover via reset', async ({ page }) => {
  await uploadBackup(page)('./fixtures/backup-invalid-v3_1.json');
  await expect(page.getByText('Failed To Read/Validate The Backup')).toBeVisible();

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page).toHaveURL(PAGE_URL + '/accounts');
});
```

- [ ] **Step 3: Verify the navigation matrix and invalid-backup recovery path**

Run: `npm --prefix cash-book-integration-tests test -- --grep "Navigation states|invalid backup screen can recover via reset"`
Expected: menu composition and recovery behavior now have direct end-to-end coverage.

- [ ] **Step 4: Commit the navigation and recovery tests**

```bash
git add cash-book-integration-tests/tests/navigation.test.ts cash-book-integration-tests/tests/backup.test.ts
git commit -m "test: cover menu states and invalid-backup recovery"
```

### Task 7: Final verification and suite cleanup

**Files:**

- Modify: `cash-book-integration-tests/playwright.config.ts`
- Modify: `cash-book-integration-tests/environment.ts`
- Modify: `cash-book-integration-tests/utils.ts`
- Modify: `cash-book-integration-tests/tests/accounts.test.ts`
- Modify: `cash-book-integration-tests/tests/backup.test.ts`
- Modify: `cash-book-integration-tests/tests/bookEntries.test.ts`
- Modify: `cash-book-integration-tests/tests/home.test.ts`
- Modify: `cash-book-integration-tests/tests/migrations.test.ts`
- Modify: `cash-book-integration-tests/tests/misc.test.ts`
- Modify: `cash-book-integration-tests/tests/setup.test.ts`
- Modify: `cash-book-integration-tests/tests/transactions.test.ts`
- Create: `cash-book-integration-tests/tests/accounts.validation.test.ts`
- Create: `cash-book-integration-tests/tests/bookEntries.edge-cases.test.ts`
- Create: `cash-book-integration-tests/tests/navigation.test.ts`
- Create: `cash-book-integration-tests/tests/transactions.validation.test.ts`

- [ ] **Step 1: Run the full integration suite locally**

Run: `npm --prefix cash-book-integration-tests test`
Expected: all Playwright tests pass in the default local browser project.

- [ ] **Step 2: Run the app unit/compile checks to ensure helper-driven assumptions still match app behavior**

Run: `npm --prefix cash-book run test:run`
Expected: exit code 0.

Run: `npm --prefix cash-book run compile`
Expected: exit code 0.

- [ ] **Step 3: Inspect the final diff for only planned test-surface changes**

Run: `git diff -- cash-book-integration-tests cash-book/src`
Expected: changes are limited to the planned test files and only any app-side hooks intentionally introduced for test stability.

- [ ] **Step 4: Create the final verification commit**

```bash
git add cash-book-integration-tests cash-book/src
git commit -m "test: stabilize and expand integration coverage"
```
