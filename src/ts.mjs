import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import jsConfig from './js.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
	jsConfig,
	{
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
			...tsPlugin.configs['recommended-requiring-type-checking'].rules
		}
	}
];
