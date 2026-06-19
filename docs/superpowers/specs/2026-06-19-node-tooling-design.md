# Node Tooling Migration Design

**Date:** 2026-06-19
**Status:** Approved

## Goal

Finish the Node tooling migration by standardizing on Node 22.22.0, removing remaining Yarn-based orchestration from the repo root and CI workflow, and moving coverage enforcement from the legacy Jest config into Vitest.

## Scope

This change covers:

- replacing `.nvmrc` with a root `.node-version`
- updating GitHub Actions to read the new version file
- fixing root `package.json` scripts to use npm consistently and correct the integration test path
- migrating coverage thresholds into `cash-book/vitest.config.ts`

This change does not attempt broader cleanup of unrelated migration leftovers.

## Approach

### Node version source of truth

Create a root `.node-version` file containing `22.22.0` and delete `.nvmrc`. Update GitHub Actions to read `.node-version` via `actions/setup-node` so local development and CI share the same pinned version.

### Root script consistency

Update the root `package.json` scripts to call project commands through npm instead of Yarn. Replace the typo in `cash-book-integrattion-tests` with the correct directory name and make the root CI wrapper call the app compile/coverage/build commands directly so npm pre-hooks do not rewrite files during CI orchestration.

### CI workflow consistency

Keep npm package-lock caching and change workflow command execution to npm as well. Since lockfiles now exist, use `npm ci` in workflow install steps for deterministic installs.

### Coverage migration

Move coverage thresholds into `cash-book/vitest.config.ts` under Vitest coverage settings. Set thresholds to the highest passing whole-number values based on the current measured coverage:

- statements: 93
- branches: 92
- functions: 88
- lines: 93

Retain text coverage reporting. Leave the legacy Jest coverage thresholds in place only if still needed for non-Vitest consumers; otherwise remove the threshold/reporter settings from the obsolete Jest block to avoid confusion.

## Verification

Verify with:

- `npm --prefix cash-book run compile`
- `npm --prefix cash-book run coverage`
- `npm --prefix cash-book run build`
- `npm run ci:cash-book`

Optionally verify the workflow file statically by ensuring it references `.node-version`, `npm ci`, and npm-based run commands.
