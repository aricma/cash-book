# Node Tooling Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the repo on Node 22.22.0, remove remaining Yarn-based root and CI orchestration, and enforce coverage through Vitest.

**Architecture:** Use a single repo-level Node version file as the source of truth, keep workflow execution aligned with npm and lockfiles, and move coverage enforcement into the Vitest config that actually runs during CI. Keep the change focused on tooling and verification, not broader app refactors.

**Tech Stack:** Node.js 22.22.0, npm, GitHub Actions, Vite, Vitest

---

### Task 1: Pin Node version in repo and CI

**Files:**

- Create: `.node-version`
- Modify: `.github/workflows/cash-book.yml`
- Delete: `.nvmrc`

- [ ] **Step 1: Add the repo Node version file**

```text
22.22.0
```

- [ ] **Step 2: Update GitHub Actions to read `.node-version` and use npm installs**

Change each `actions/setup-node` block to:

```yaml
with:
  node-version-file: .node-version
  cache: npm
  cache-dependency-path: cash-book/package-lock.json
```

and for the integration-tests job:

```yaml
with:
  node-version-file: .node-version
  cache: npm
  cache-dependency-path: cash-book-integration-tests/package-lock.json
```

Change install steps from `npm install` to `npm ci`.

- [ ] **Step 3: Remove the old Node version file**

Delete `.nvmrc`.

- [ ] **Step 4: Verify workflow references**

Run: `rg -n "node-version-file|npm ci|\.nvmrc|\.node-version" .github/workflows/cash-book.yml .node-version`

Expected: workflow references `.node-version`, uses `npm ci`, and does not reference `.nvmrc`.

### Task 2: Fix root npm orchestration

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Replace Yarn-based root scripts with npm-based scripts**

Update the scripts block so these entries become:

```json
{
  "ci:cash-book": "export CI=true && npm --prefix cash-book run compile && npm --prefix cash-book run coverage && npm --prefix cash-book run build",
  "ci:cash-book-integration-tests": "export CI=true && npm --prefix cash-book-integration-tests run test",
  "ci": "npm run ci:cash-book && npm run ci:cash-book-integration-tests"
}
```

- [ ] **Step 2: Verify root CI script resolves correctly**

Run: `npm run ci:cash-book`

Expected: the script runs the cash-book compile, coverage, and build commands through npm without referencing Yarn or the misspelled directory.

### Task 3: Migrate coverage enforcement to Vitest

**Files:**

- Modify: `cash-book/vitest.config.ts`
- Modify: `cash-book/package.json`

- [ ] **Step 1: Add Vitest coverage settings**

Extend `cash-book/vitest.config.ts` with a `coverage` block containing:

```ts
coverage: {
  provider: "v8",
  reporter: ["text"],
  thresholds: {
    statements: 93,
    branches: 92,
    functions: 88,
    lines: 93,
  },
},
```

- [ ] **Step 2: Remove obsolete Jest coverage threshold settings**

Delete `coverageThreshold` and `coverageReporters` from the `jest` block in `cash-book/package.json` so the file no longer suggests Jest is enforcing coverage.

- [ ] **Step 3: Run coverage to verify Vitest enforcement**

Run: `npm --prefix cash-book run coverage`

Expected: exit code 0 and coverage output meeting thresholds.

### Task 4: Align workflow command execution with npm

**Files:**

- Modify: `.github/workflows/cash-book.yml`

- [ ] **Step 1: Replace Yarn run commands in workflow jobs**

Update these workflow commands:

```yaml
run: npm run compile
run: npm run coverage
run: npm run build
```

Keep Playwright execution as `npx playwright test`.

- [ ] **Step 2: Verify the app CI script end-to-end**

Run: `npm run ci:cash-book`

Expected: compile, coverage, and build all succeed through the root wrapper script.

### Task 5: Final verification

**Files:**

- Modify: `.node-version`
- Modify: `.github/workflows/cash-book.yml`
- Modify: `package.json`
- Modify: `cash-book/package.json`
- Modify: `cash-book/vitest.config.ts`
- Delete: `.nvmrc`

- [ ] **Step 1: Run compile**

Run: `npm --prefix cash-book run compile`

Expected: exit code 0.

- [ ] **Step 2: Run coverage**

Run: `npm --prefix cash-book run coverage`

Expected: exit code 0 with thresholds enforced by Vitest.

- [ ] **Step 3: Run production build**

Run: `npm --prefix cash-book run build`

Expected: exit code 0.

- [ ] **Step 4: Check final diff**

Run: `git diff -- .node-version .github/workflows/cash-book.yml package.json cash-book/package.json cash-book/vitest.config.ts .nvmrc`

Expected: only the planned tooling changes appear.
