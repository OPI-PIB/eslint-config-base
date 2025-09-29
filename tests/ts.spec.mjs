import { unlinkSync, writeFileSync } from 'fs';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { resolve } from 'path';

import { ESLint } from 'eslint';

import eslintConfig from '../src/ts.mjs';

const tempTsConfigPath = resolve('./tsconfig.temp.json');

const tempFilePath = resolve('./temp-test-file.ts');

const eslint = new ESLint({
	overrideConfig: eslintConfig
});

async function lintCode(code) {
	writeFileSync(tempFilePath, code);
	const results = await eslint.lintFiles(tempFilePath);
	return results[0].messages;
}

describe('TypeScript ESLint config', () => {
	before(() => {
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

		eslintConfig.languageOptions.parserOptions.project = tempTsConfigPath;
	});

	after(() => {
		unlinkSync(tempTsConfigPath);
		unlinkSync(tempFilePath);
	});
	it('should catch import duplicates (import plugin)', async () => {
		const code = `
					import fs from 'fs';
					import fs from 'fs';
				`;
		const messages = await lintCode(code);
		const importErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('import/'));
		assert(importErrors.length > 0);
	});

	it('should catch invalid type assertions', async () => {
		const code = `
	    const x = 'hello' as number;
	  `;
		const messages = await lintCode(code);
		const typeErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/'));
		assert(typeErrors.length > 0);
	});

	it('should catch TS-specific type-checking rules', async () => {
		const code = `
      const a: string = 123; // Type mismatch
    `;
		const messages = await lintCode(code);
		const typeCheckErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('@typescript-eslint/'));
		assert(typeCheckErrors.length > 0);
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
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/adjacent-overload-signatures'));
	});

	it('@typescript-eslint/ban-ts-comment', async () => {
		const code = `
			// @ts-ignore
			const x: number = 'hello';
		`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/ban-ts-comment'));
	});

	it('@typescript-eslint/no-array-constructor', async () => {
		const code = `const arr = new Array();`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-array-constructor'));
	});

	it('@typescript-eslint/no-empty-function', async () => {
		const code = `function foo() {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-function'));
	});

	it('@typescript-eslint/no-empty-interface', async () => {
		const code = `interface A {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-interface'));
	});

	it('@typescript-eslint/no-empty-object-type', async () => {
		const code = `type A = {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-empty-object-type'));
	});

	it('@typescript-eslint/no-inferrable-types', async () => {
		const code = `const x: number = 5;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-inferrable-types'));
	});

	it('@typescript-eslint/no-loss-of-precision', async () => {
		const code = `const x: number = 9007199254740993;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-loss-of-precision'));
	});

	it('@typescript-eslint/no-misused-new', async () => {
		const code = `interface Foo { new (): Foo; }`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-misused-new'));
	});

	it('@typescript-eslint/no-namespace', async () => {
		const code = `namespace A {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-namespace'));
	});

	it('@typescript-eslint/no-non-null-asserted-optional-chain', async () => {
		const code = `const x = obj?.prop!;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-non-null-asserted-optional-chain'));
	});

	it('@typescript-eslint/no-shadow', async () => {
		const code = `let x = 1; { let x = 2; }`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-shadow'));
	});

	it('@typescript-eslint/no-this-alias', async () => {
		const code = `const self = this;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-this-alias'));
	});

	it('@typescript-eslint/no-unnecessary-type-constraint', async () => {
		const code = `function foo<T extends unknown>(x: T) {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-unnecessary-type-constraint'));
	});

	it('@typescript-eslint/no-unsafe-function-type', () => {
		assert.strictEqual(eslintConfig.rules['@typescript-eslint/no-unsafe-function-type'], 'error');
	});

	it('@typescript-eslint/no-unused-vars', async () => {
		const code = `const unused = 1;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-unused-vars'));
	});

	it('@typescript-eslint/no-var-requires', () => {
		assert.strictEqual(eslintConfig.rules['@typescript-eslint/no-var-requires'], 'error');
	});

	it('@typescript-eslint/no-wrapper-object-types', async () => {
		const code = `const x: Number = 5;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-wrapper-object-types'));
	});

	it('@typescript-eslint/prefer-as-const', () => {
		assert.strictEqual(eslintConfig.rules['@typescript-eslint/prefer-as-const'], 'error');
	});

	it('@typescript-eslint/prefer-namespace-keyword', async () => {
		const code = `module A {}`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/prefer-namespace-keyword'));
	});

	it('@typescript-eslint/triple-slash-reference', async () => {
		const code = `/// <reference path="file.ts" />`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/triple-slash-reference'));
	});

	it('no-var', async () => {
		const code = `var x = 1;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === 'no-var'));
	});

	it('prefer-const', async () => {
		const code = `let y = 2;`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === 'prefer-const'));
	});

	it('prefer-rest-params', async () => {
		const code = `function foo() { return arguments[0] as number; } foo();`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === 'prefer-rest-params'));
	});

	it('prefer-spread', async () => {
		const code = `const numbers = [1,2,3]; Math.max.apply(Math, numbers);`;
		const messages = await lintCode(code);
		assert.ok(messages.some((m) => m.ruleId === 'prefer-spread'));
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
				assert.strictEqual(eslintConfig.rules[rule], 'off');
			});
		});
	});
});
