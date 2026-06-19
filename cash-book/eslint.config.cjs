const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // App source
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // ---------------------------------------------------------------------------
      // Base React rules
      // ---------------------------------------------------------------------------
      // Keep the official recommended rule sets as a baseline.
      // Everything below is an explicit, conscious deviation from these defaults.
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // ---------------------------------------------------------------------------
      // TypeScript legacy tolerance (migration mode)
      // ---------------------------------------------------------------------------
      // Allow `any` during migration. This codebase contains intentional escape
      // hatches and historical typings that are not worth refactoring right now.
      // TODO: Re-enable once types are cleaned up.
      "@typescript-eslint/no-explicit-any": "off",

      // Allow unused variables that are explicitly marked as ignored via `_`.
      // This is common in reducers, callbacks, and destructuring.
      // We keep this as `warn` to retain some signal without blocking CI.
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],

      // ---------------------------------------------------------------------------
      // Refactor-later correctness / style rules
      // ---------------------------------------------------------------------------
      // Double negation (`!!value`) is intentionally used throughout the codebase
      // for explicit boolean coercion. Disabling avoids noisy, low-value warnings.
      "no-extra-boolean-cast": "off",

      // Switch-case blocks often declare scoped variables.
      // Refactoring all of these is non-trivial and not worth blocking progress.
      "no-case-declarations": "off",

      // React list rendering keys are missing in some legacy components.
      // This can be fixed later when those components are touched.
      "react/jsx-key": "off",

      // Many components are anonymous (HOCs, forwardRef, inline components).
      // Enforcing display names here provides little value.
      "react/display-name": "off",

      // This project uses TypeScript for props typing.
      // `prop-types` is redundant and intentionally not used.
      "react/prop-types": "off",

      // ---------------------------------------------------------------------------
      // Hooks / refs strictness
      // ---------------------------------------------------------------------------
      // `react-hooks/refs` complains about ref usage during render.
      // Some integrations (e.g. react-dnd) legitimately do this.
      // Turning this off avoids false positives until a deeper refactor.
      "react-hooks/refs": "off",

      // ---------------------------------------------------------------------------
      // Linting ergonomics
      // ---------------------------------------------------------------------------
      // Disable warnings about unused eslint-disable comments.
      // During migration, rules change frequently and this just adds noise.
      // NOTE: This is controlled via `linterOptions.reportUnusedDisableDirectives`
      // in flat config, but we keep this here for clarity of intent.
      "no-unused-disable": "off",

      // Console usage is still considered an error in application code.
      // This is one of the few rules we intentionally keep strict.
      "no-console": "error",

      // ---------------------------------------------------------------------------
      // TEMP: unblock migration/refactor (TypeScript strictness)
      // ---------------------------------------------------------------------------

      // Some legacy enums reuse string values. This is a real smell, but not worth
      // fixing during the toolchain migration.
      "@typescript-eslint/no-duplicate-enum-values": "off",

      // Legacy code uses `{}` as “some object-ish type”. This rule is correct but
      // too disruptive to fix right now.
      "@typescript-eslint/no-empty-object-type": "off",

      // Allow `@ts-ignore` / `@ts-nocheck` in legacy code and tests.
      // Later: migrate to @ts-expect-error.
      "@typescript-eslint/ban-ts-comment": "off",

      // Expand unused-vars exceptions beyond "_" placeholders.
      // This silences common legacy names like `e` and `key`.
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^(_|e|err|error|key)$",
        caughtErrorsIgnorePattern: "^(_|e|err|error)$",
      }],
    },
  },

  // Tests (Vitest globals)
  {
    files: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}", "src/**/__tests__/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  }
);
