# Netlify Build Output Design

**Goal:** Make Netlify deploy the Vite app from an explicit repo config while keeping the published artifact directory named `build`.

## Context

- The deployed app lives in `cash-book/`.
- Netlify was configured to publish `cash-book/build`, but Vite currently emits `cash-book/dist`.
- The deploy failed because the configured publish directory does not exist after the build.

## Decision

Use repository-owned configuration for both the deployment target and the Vite output directory:

1. Add a root `netlify.toml` that sets:
   - `base = "cash-book"`
   - `command = "yarn build"`
   - `publish = "build"`
2. Update `cash-book/vite.config.ts` to set `build.outDir = "build"`.

## Why this approach

- Keeps deployment settings in version control instead of only in the Netlify UI.
- Makes the publish directory explicit and aligned with the existing expectation of a `build/` folder.
- Limits the change to deployment-related config only.

## Files

- Create: `netlify.toml`
- Modify: `cash-book/vite.config.ts`

## Verification

- Run `npm run build` in `cash-book/`.
- Confirm `cash-book/build/index.html` exists after the build.
