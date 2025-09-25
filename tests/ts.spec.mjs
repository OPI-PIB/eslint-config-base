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

const [, tsConfig] = eslintConfig;

async function lintCode(code) {
	const filePath = `./test-${Date.now()}-${Math.random()}.ts`;
	const tempFile = resolve(filePath);

	writeFileSync(tempFile, code);
	const results = await eslint.lintText(code, { filePath });
	unlinkSync(tempFile);
	return results[0].messages;
}

describe('TypeScript ESLint config', () => {
	it('should catch import duplicates (import plugin)', async () => {
		const code = `
					import fs from 'fs';
					import fs from 'fs';
				`;
		const messages = await lintCode(code);
		const importErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('import/'));
		expect(importErrors.length).toBeGreaterThan(0);
	});

	it('should catch invalid type assertions', async () => {
		const code = `
	    const x = 'hello' as number;
	  `;
		const messages = await lintCode(code);
		const typeErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/'));
		expect(typeErrors.length).toBeGreaterThan(0);
	});

	it('should catch TS-specific type-checking rules', async () => {
		const code = `
      const a: string = 123; // Type mismatch
    `;
		const messages = await lintCode(code);
		const typeCheckErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/'));
		expect(typeCheckErrors.length).toBeGreaterThan(0);
	});

	it('@typescript-eslint/adjacent-overload-signatures', async () => {
		const code = `
			class A {
				foo(x: number): void; 
				bar() {}  // unrelated member
				foo(x: string): void { console.log(x); }
			}
			const a = new A();
			a.foo('');
		`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/adjacent-overload-signatures')).toBe(true);
	});

	it('@typescript-eslint/ban-ts-comment', async () => {
		const code = `
			// @ts-ignore
			const x: number = 'hello';
		`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/ban-ts-comment')).toBe(true);
	});

	it('@typescript-eslint/no-array-constructor', async () => {
		const code = `const arr = new Array();`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-array-constructor')).toBe(true);
	});

	it('@typescript-eslint/no-empty-function', async () => {
		const code = `function foo() {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-function')).toBe(true);
	});

	it('@typescript-eslint/no-empty-interface', async () => {
		const code = `interface A {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-interface')).toBe(true);
	});

	it('@typescript-eslint/no-empty-object-type', async () => {
		const code = `type A = {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-object-type')).toBe(true);
	});

	it('@typescript-eslint/no-inferrable-types', async () => {
		const code = `const x: number = 5;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-inferrable-types')).toBe(true);
	});

	it('@typescript-eslint/no-loss-of-precision', async () => {
		const code = `const x: number = 9007199254740993;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-loss-of-precision')).toBe(true);
	});

	it('@typescript-eslint/no-misused-new', async () => {
		const code = `interface Foo { new (): Foo; }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-misused-new')).toBe(true);
	});

	it('@typescript-eslint/no-namespace', async () => {
		const code = `namespace A {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-namespace')).toBe(true);
	});

	it('@typescript-eslint/no-non-null-asserted-optional-chain', async () => {
		const code = `const x = obj?.prop!;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-non-null-asserted-optional-chain')).toBe(true);
	});

	it('@typescript-eslint/no-shadow', async () => {
		const code = `let x = 1; { let x = 2; }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-shadow')).toBe(true);
	});

	it('@typescript-eslint/no-this-alias', async () => {
		const code = `const self = this;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-this-alias')).toBe(true);
	});

	it('@typescript-eslint/no-unnecessary-type-constraint', async () => {
		const code = `function foo<T extends unknown>(x: T) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-unnecessary-type-constraint')).toBe(true);
	});

	it('@typescript-eslint/no-unsafe-function-type', () => {
		expect(tsConfig.rules['@typescript-eslint/no-unsafe-function-type']).toBe('error');
	});

	it('@typescript-eslint/no-unused-vars', async () => {
		const code = `const unused = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-unused-vars')).toBe(true);
	});

	it('@typescript-eslint/no-var-requires', () => {
		expect(tsConfig.rules['@typescript-eslint/no-var-requires']).toBe('error');
	});

	it('@typescript-eslint/no-wrapper-object-types', async () => {
		const code = `const x: Number = 5;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/no-wrapper-object-types')).toBe(true);
	});

	it('@typescript-eslint/prefer-as-const', () => {
		expect(tsConfig.rules['@typescript-eslint/prefer-as-const']).toBe('error');
	});

	it('@typescript-eslint/prefer-namespace-keyword', async () => {
		const code = `module A {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/prefer-namespace-keyword')).toBe(true);
	});

	it('@typescript-eslint/triple-slash-reference', async () => {
		const code = `/// <reference path="file.ts" />`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === '@typescript-eslint/triple-slash-reference')).toBe(true);
	});

	it('no-var', async () => {
		const code = `var x = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-var')).toBe(true);
	});

	it('prefer-const', async () => {
		const code = `let y = 2;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'prefer-const')).toBe(true);
	});

	it('prefer-rest-params', async () => {
		const code = `function foo() { return arguments[0] as number; } foo();`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'prefer-rest-params')).toBe(true);
	});

	it('prefer-spread', async () => {
		const code = `const numbers = [1,2,3]; Math.max.apply(Math, numbers);`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'prefer-spread')).toBe(true);
	});

	describe('turned off rules:', () => {
		const rules = [
			'@typescript-eslint/no-explicit-any',
			'@typescript-eslint/no-non-null-assertion',
			'constructor-super',
			'getter-return',
			'no-array-constructor',
			'no-const-assign',
			'no-dupe-args',
			'no-dupe-class-members',
			'no-dupe-keys',
			'no-empty-function',
			'no-func-assign',
			'no-import-assign',
			'no-loss-of-precision',
			'no-new-symbol',
			'no-obj-calls',
			'no-redeclare',
			'no-setter-return',
			'no-shadow',
			'no-this-before-super',
			'no-undef',
			'no-unreachable',
			'no-unsafe-negation',
			'no-unused-vars',
			'valid-typeof'
		];

		rules.forEach((rule) => {
			it(rule, () => {
				expect(tsConfig.rules[rule]).toBe('off');
			});
		});
	});
});
