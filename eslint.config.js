import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: ["build/", ".svelte-kit/", ".vercel/", "dist/", "node_modules/"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: { parser: ts.parser },
    },
    rules: {
      "svelte/valid-compile": ["error", { ignoreWarnings: true }],
      "svelte/no-at-html-tags": "off",
    },
  },
  {
    // Ported admin subsystem (from fav-storefront) — relaxed rules.
    files: [
      "src/routes/(admin)/**",
      "src/lib/components/admin/**",
      "src/lib/components/ui/**",
      "src/lib/layouts/**",
      "src/lib/api/**",
      "src/lib/types/**",
      "src/lib/utils/**",
    ],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
);
