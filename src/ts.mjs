import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import jsConfig from './js.mjs';

/** @type {import('eslint').Linter.Config} */
export default {
	...jsConfig,
	files: ['**/*.{ts,tsx,mts}'],
	languageOptions: {
		...jsConfig.languageOptions,
		parser: tsParser,
		parserOptions: {
			...jsConfig.languageOptions.parserOptions,
			project: './tsconfig.json'
		}
	},
	plugins: {
		...jsConfig.plugins,
		'@typescript-eslint': tsPlugin
	},
	rules: {
		...jsConfig.rules,
		...tsPlugin.configs.recommended.rules,
		...tsPlugin.configs['recommended-requiring-type-checking'].rules,
		'constructor-super': 'off',
		'getter-return': 'off',
		'no-const-assign': 'off',
		'no-dupe-args': 'off',
		'no-dupe-class-members': 'off',
		'no-dupe-keys': 'off',
		'no-empty-function': 'off',
		'no-func-assign': 'off',
		'no-import-assign': 'off',
		'no-loss-of-precision': 'off',
		'no-new-symbol': 'off',
		'no-obj-calls': 'off',
		'no-redeclare': 'off',
		'no-setter-return': 'off',
		'no-shadow': 'off',
		'no-this-before-super': 'off',
		'no-unreachable': 'off',
		'no-unsafe-negation': 'off',
		'valid-typeof': 'off',
		'no-var': 'error',
		'prefer-const': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/no-empty-function': [
			'error',
			{
				allow: ['private-constructors', 'protected-constructors']
			}
		],
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/no-loss-of-precision': 'error',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/no-var-requires': 'error'
	}
};
