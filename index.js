// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const assertions = require('@opi_pib/eslint-plugin-assertions');

module.exports = tseslint.config({
	files: ['**/*.ts'],
	extends: [
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		...tseslint.configs.stylistic,
	],
	plugins: {
		'@opi_pib/assertions': assertions,
	},
	rules: {},
});
