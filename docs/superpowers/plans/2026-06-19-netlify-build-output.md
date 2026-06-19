# Netlify Build Output Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the Vite app and Netlify to build from `cash-book/` and publish a `build/` directory.

**Architecture:** Store Netlify deploy settings in a root `netlify.toml` and update Vite so its production output directory matches Netlify's publish directory. This is a config-only change, so verification is the build command and artifact path rather than a new automated test.

**Tech Stack:** Netlify, Vite, React, TypeScript

---

### Task 1: Align Netlify and Vite build output

**Files:**

- Create: `netlify.toml`
- Modify: `cash-book/vite.config.ts`
- Verify: `cash-book/build/index.html`

- [ ] **Step 1: Create explicit Netlify config**

```toml
[build]
  base = "cash-book"
  command = "yarn build"
  publish = "build"
```

- [ ] **Step 2: Update Vite output directory**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
});
```

- [ ] **Step 3: Run build to verify output path**

Run: `cd cash-book && npm run build`
Expected: Vite completes successfully and writes files under `build/`

- [ ] **Step 4: Confirm the built artifact exists**

Run: `test -f cash-book/build/index.html`
Expected: exit code 0

- [ ] **Step 5: Commit**

```bash
git add netlify.toml cash-book/vite.config.ts docs/superpowers/specs/2026-06-19-netlify-build-output-design.md docs/superpowers/plans/2026-06-19-netlify-build-output.md
git commit -m "build: align netlify publish directory with vite output"
```
