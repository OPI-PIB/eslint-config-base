// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const assertions = require('@opi_pib/eslint-plugin-assertions');
const importPlugin = require('eslint-plugin-import');

module.exports = {
	configs: {
		ts: tseslint.config({
			files: ['**/*.ts'],
			extends: [
				eslint.configs.recommended,
				...tseslint.configs.recommended,
				...tseslint.configs.stylistic,
				...angular.configs.tsRecommended,
			],
			processor: angular.processInlineTemplates,
			plugins: {
				import: importPlugin,
				'@opi_pib/assertions': assertions,
			},
		}),
		html: tseslint.config({
			files: ['**/*.html'],
			extends: [
				...angular.configs.templateRecommended,
				...angular.configs.templateAccessibility,
			],
			rules: {},
		}),
	},
};
