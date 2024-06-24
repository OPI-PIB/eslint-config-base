# @opi_pib/eslint-config-base

## Install

```
npm install -D @opi_pib/eslint-config-base
```

## Config

eslint.config.js

```
// @ts-check
const tseslint = require("typescript-eslint");
const opiBase = require("@opi_pib/eslint-config-base");

module.exports = tseslint.config(
	{
		files: ["**/*.ts"],
		extends: [...opiBase.configs.ts],
		rules: {
			"@angular-eslint/directive-selector": [
				"error",
				{
					type: "attribute",
					prefix: "sedn",
					style: "camelCase",
				},
			],
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "sedn",
					style: "kebab-case",
				},
			],
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal"],
					pathGroups: [
						{
							pattern:
								"@{domain,shared,pages,rest,translations,e2e}/**",
							group: "internal",
						},
						{
							pattern: "@environment",
							group: "internal",
						},
					],
					pathGroupsExcludedImportTypes: ["builtin"],
					"newlines-between": "always",
				},
			],
			"import/no-extraneous-dependencies": [
				"error",
				{
					devDependencies: [
						"./e2e/**/*",
						"**/*.spec.ts",
						"./playwright.config.ts",
					],
				},
			],
			"@opi_pib/assertions/assertions-code": ["error", "^[a-z0-9]{8}$"],
			"@opi_pib/assertions/assertions-condition": ["error"],
		},
	},
	{
		files: ["**/*.html"],
		extends: [...opiBase.configs.html],
	},
);

```

## VS Code settings.json

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "eslint.format.enable": true
}
```
