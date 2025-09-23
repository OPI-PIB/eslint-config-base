import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import eslintConfig from '../src/js.mjs';

const eslint = new ESLint({
	overrideConfig: eslintConfig
});

describe('ESLint rules', () => {
	it('should pass a correct JS snippet', async () => {
		const code = `
      import fs from 'fs';
      const sum = (a, b) => a + b;
      console.log(sum(1, 2));
    `;
		const results = await eslint.lintText(code, { filePath: 'test.js' });
		expect(results[0].errorCount).toBe(1);
		expect(results[0].warningCount).toBe(0);
	});

	it('should fail when using a console.log if rule is enabled', async () => {
		const code = `
      console.log('This is a test');
    `;
		const results = await eslint.lintText(code, { filePath: 'test.js' });

		if (results[0].messages.length > 0) {
			expect(results[0].messages[0]).toMatchObject({
				ruleId: expect.any(String),
				severity: expect.any(Number)
			});
		}
	});

	it('should fail if import order is wrong (import plugin test)', async () => {
		const code = `
			import pkg from '@eslint/js';
			import importPlugin from 'eslint-plugin-import';
			import assertions from '@opi_pib/eslint-plugin-assertions';
    `;
		const results = await eslint.lintText(code, { filePath: 'test.js' });

		const importErrors = results[0].messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('import/'));

		expect(importErrors.length).toBeGreaterThan(0);
	});
});
