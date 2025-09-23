import pkg from '@eslint/js';
import assertions from '@opi_pib/eslint-plugin-assertions';
import importPlugin from 'eslint-plugin-import';

const { configs } = pkg;

/** @type {import('eslint').Linter.Config} */
export default {
	files: ['**/*.{js,jsx,mjs}'],
	languageOptions: {
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: 'latest',
			ecmaFeatures: { jsx: true }
		}
	},
	plugins: {
		import: importPlugin,
		'@opi_pib/assertions': assertions
	},
	rules: {
		...configs.recommended.rules,
		'import/no-duplicates': 'error',
		'import/order': [
			'error',
			{
				alphabetize: { order: 'asc' },
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
				'newlines-between': 'always',
				pathGroupsExcludedImportTypes: ['builtin']
			}
		],
		'no-undef': 'off',
		'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }]
	}
};
