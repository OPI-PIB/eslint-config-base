/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: [
		'./rules/best-practices',
		'./rules/errors',
		'./rules/node',
		'./rules/style',
		'./rules/variables',
		'./rules/es6',
		'./rules/imports',
		'./rules/strict',
		'./rules/prettier',
	].map(require.resolve),
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
	},
	plugins: ['@typescript-eslint'],
	rules: {},
};
