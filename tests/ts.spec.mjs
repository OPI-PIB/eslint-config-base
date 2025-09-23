import { unlinkSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { ESLint } from 'eslint';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import eslintConfig from '../src/ts.mjs';

const tempTsConfigPath = resolve('./tsconfig.temp.json');

beforeAll(() => {
	writeFileSync(
		tempTsConfigPath,
		JSON.stringify({
			compilerOptions: {
				target: 'ESNext',
				module: 'ESNext',
				strict: true,
				esModuleInterop: true
			},
			include: ['*.ts', '**/*.ts']
		})
	);

	eslintConfig.forEach((entry) => {
		if (entry.languageOptions?.parserOptions?.project) {
			entry.languageOptions.parserOptions.project = tempTsConfigPath;
		}
	});
});

afterAll(() => {
	unlinkSync(tempTsConfigPath);
});

const eslint = new ESLint({
	overrideConfig: eslintConfig
});

describe('TypeScript ESLint config', () => {
	it('should pass a correct TypeScript snippet', async () => {
		const code = `
      const sum = (a: number, b: number): number => a + b;
      console.log(sum(1, 2));
    `;
		const tempFile = resolve('./test.ts');
		writeFileSync(tempFile, code);
		const results = await eslint.lintText(code, { filePath: 'test.ts' });
		expect(results[0].errorCount).toBe(0);
		expect(results[0].warningCount).toBe(0);
		unlinkSync(tempFile);
	});

	it('should catch unused variables', async () => {
		const code = `
					const unusedVar = 123;
				`;
		const tempFile = resolve('./test.ts');
		writeFileSync(tempFile, code);
		const results = await eslint.lintText(code, { filePath: 'test.ts' });
		const unusedVarErrors = results[0].messages.filter((msg) => msg.ruleId === '@typescript-eslint/no-unused-vars');
		expect(unusedVarErrors.length).toBeGreaterThan(0);
		unlinkSync(tempFile);
	});

	it('should catch import duplicates (import plugin)', async () => {
		const code = `
					import fs from 'fs';
					import fs from 'fs';
				`;
		const tempFile = resolve('./test.ts');
		writeFileSync(tempFile, code);
		const results = await eslint.lintText(code, { filePath: 'test.ts' });
		const importErrors = results[0].messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('import/'));
		expect(importErrors.length).toBeGreaterThan(0);
		unlinkSync(tempFile);
	});

	it('should catch invalid type assertions', async () => {
		const code = `
      const x = 'hello' as number;
    `;
		const tempFile = resolve('./test.ts');
		writeFileSync(tempFile, code);
		const results = await eslint.lintText(code, { filePath: 'test.ts' });
		const typeErrors = results[0].messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/'));
		expect(typeErrors.length).toBeGreaterThan(0);
		unlinkSync(tempFile);
	});

	it('should catch TS-specific type-checking rules', async () => {
		const code = `
      const a: string = 123; // Type mismatch
    `;
		const tempFile = resolve('./test.ts');
		writeFileSync(tempFile, code);
		const results = await eslint.lintText(code, { filePath: 'test.ts' });
		const typeCheckErrors = results[0].messages.filter(
			(msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/')
		);
		expect(typeCheckErrors.length).toBeGreaterThan(0);
		unlinkSync(tempFile);
	});
});
