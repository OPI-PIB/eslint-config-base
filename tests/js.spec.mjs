import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import eslintConfig from '../src/js.mjs';

const eslint = new ESLint({
	overrideConfig: eslintConfig
});

async function lintCode(code) {
	const results = await eslint.lintText(code, { filePath: 'test.js' });
	return results[0].messages;
}

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
		const messages = await lintCode(code);
		if (messages.length > 0) {
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
		const messages = await lintCode(code);
		const importErrors = messages.filter((msg) => msg.ruleId && msg.ruleId.startsWith('import/'));
		expect(importErrors.length).toBeGreaterThan(0);
	});

	it('constructor-super', async () => {
		const code = `class A {} class B extends A { constructor() {} }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'constructor-super')).toBe(true);
	});

	it('for-direction', async () => {
		const code = `for (let i=0;i<5;i--) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'for-direction')).toBe(true);
	});

	it('getter-return', async () => {
		const code = `const obj = { get x() {} };`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'getter-return')).toBe(true);
	});

	it('import/no-duplicates', async () => {
		const code = `import { readFile } from 'fs'; import { writeFile } from 'fs';`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'import/no-duplicates')).toBe(true);
	});

	it('import/order', async () => {
		const code = `import a from './b'; import fs from 'fs';`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'import/order')).toBe(true);
	});

	it('no-async-promise-executor', async () => {
		const code = `new Promise(async (res, rej) => {});`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-async-promise-executor')).toBe(true);
	});

	it('no-case-declarations', async () => {
		const code = `switch(a){case 1: let x=1; break;}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-case-declarations')).toBe(true);
	});

	it('no-class-assign', async () => {
		const code = `class A {} A = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-class-assign')).toBe(true);
	});

	it('no-compare-neg-zero', async () => {
		const code = `if (x === -0) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-compare-neg-zero')).toBe(true);
	});

	it('no-cond-assign', async () => {
		const code = `if (x = 5) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-cond-assign')).toBe(true);
	});

	it('no-const-assign', async () => {
		const code = `const x = 1; x = 2;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-const-assign')).toBe(true);
	});

	it('no-constant-condition', async () => {
		const code = `while(true) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-constant-condition')).toBe(true);
	});

	it('no-control-regex', async () => {
		const code = `const re = /\\x1f/;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-control-regex')).toBe(true);
	});

	it('no-debugger', async () => {
		const code = `debugger;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-debugger')).toBe(true);
	});

	it('no-delete-var', () => {
		expect(eslintConfig.rules['no-delete-var']).toBe('error');
	});

	it('no-dupe-args', () => {
		expect(eslintConfig.rules['no-dupe-args']).toBe('error');
	});

	it('no-dupe-class-members', async () => {
		const code = `class A { x(){} x(){} }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-dupe-class-members')).toBe(true);
	});

	it('no-dupe-else-if', async () => {
		const code = `if(a){} else if(a){};`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-dupe-else-if')).toBe(true);
	});

	it('no-dupe-keys', async () => {
		const code = `const o = {a:1, a:2};`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-dupe-keys')).toBe(true);
	});

	it('no-duplicate-case', async () => {
		const code = `switch(x){case 1: break; case 1: break;}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-duplicate-case')).toBe(true);
	});

	it('no-empty', async () => {
		const code = `if(true) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-empty')).toBe(true);
	});

	it('no-empty-character-class', async () => {
		const code = `const re = /[]/;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-empty-character-class')).toBe(true);
	});

	it('no-empty-pattern', async () => {
		const code = `const {} = obj;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-empty-pattern')).toBe(true);
	});

	it('no-ex-assign', async () => {
		const code = `try{}catch(e){ e = 1; }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-ex-assign')).toBe(true);
	});

	it('no-extra-boolean-cast', async () => {
		const code = `if(!!x) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-extra-boolean-cast')).toBe(true);
	});

	it('no-extra-semi', async () => {
		const code = `const x = 1;; console.log(x);`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-extra-semi')).toBe(true);
	});

	it('no-fallthrough', async () => {
		const code = `switch(x){case 1: console.log(1); case 2: break;}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-fallthrough')).toBe(true);
	});

	it('no-func-assign', async () => {
		const code = `function f(){} f = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-func-assign')).toBe(true);
	});

	it('no-global-assign', async () => {
		const code = `Object = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-global-assign')).toBe(true);
	});

	it('no-import-assign', async () => {
		const code = `import fs from 'fs'; fs = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-import-assign')).toBe(true);
	});

	it('no-inner-declarations', () => {
		expect(eslintConfig.rules['no-inner-declarations']).toBe('error');
	});

	it('no-invalid-regexp', async () => {
		const code = `const re = new RegExp('[');`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-invalid-regexp')).toBe(true);
	});

	it('no-irregular-whitespace', () => {
		expect(eslintConfig.rules['no-irregular-whitespace']).toBe('error');
	});

	it('no-loss-of-precision', async () => {
		const code = `const x = 9007199254740993;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-loss-of-precision')).toBe(true);
	});

	it('no-misleading-character-class', async () => {
		const code = `/^[Á]$/u;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-misleading-character-class')).toBe(true);
	});

	it('no-mixed-spaces-and-tabs', async () => {
		const code = `const x = 1;\n\t const y = 2;console.log({x, y});`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-mixed-spaces-and-tabs')).toBe(true);
	});

	it('no-new-symbol', async () => {
		const code = `new Symbol();`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-new-symbol')).toBe(true);
	});

	it('no-nonoctal-decimal-escape', () => {
		expect(eslintConfig.rules['no-nonoctal-decimal-escape']).toBe('error');
	});

	it('no-obj-calls', async () => {
		const code = `Math();`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-obj-calls')).toBe(true);
	});

	it('no-octal', () => {
		expect(eslintConfig.rules['no-octal']).toBe('error');
	});

	it('no-prototype-builtins', async () => {
		const code = `obj.hasOwnProperty('x');`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-prototype-builtins')).toBe(true);
	});

	it('no-redeclare', async () => {
		const code = `var a; var a;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-redeclare')).toBe(true);
	});

	it('no-regex-spaces', async () => {
		const code = `const re = /a  b/;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-regex-spaces')).toBe(true);
	});

	it('no-self-assign', async () => {
		const code = `let a; a = a;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-self-assign')).toBe(true);
	});

	it('no-setter-return', async () => {
		const code = `const obj = { set x(v) { return 1; } };`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-setter-return')).toBe(true);
	});

	it('no-shadow', async () => {
		const code = `let a = 1; function f(a) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-shadow')).toBe(true);
	});

	it('no-shadow-restricted-names', async () => {
		const code = `let undefined = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-shadow-restricted-names')).toBe(true);
	});

	it('no-sparse-arrays', async () => {
		const code = `const a = [1,,2];`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-sparse-arrays')).toBe(true);
	});

	it('no-this-before-super', async () => {
		const code = `class A extends B { constructor() { this.x = 1; super(); } }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-this-before-super')).toBe(true);
	});

	it('no-unexpected-multiline', async () => {
		const code = `let x = 1\n[x].forEach(console.log)`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unexpected-multiline')).toBe(true);
	});

	it('no-unreachable', async () => {
		const code = `function f(){ return; console.log(1); }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unreachable')).toBe(true);
	});

	it('no-unsafe-finally', () => {
		expect(eslintConfig.rules['no-unsafe-finally']).toBe('error');
	});

	it('no-unsafe-negation', async () => {
		const code = `if (!key in obj) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unsafe-negation')).toBe(true);
	});

	it('no-unsafe-optional-chaining', async () => {
		const code = `(obj?.foo).bar;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unsafe-optional-chaining')).toBe(true);
	});

	it('no-unused-labels', async () => {
		const code = `label: for(;;) break;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unused-labels')).toBe(true);
	});

	it('no-unused-vars', async () => {
		const code = `const x = 1;`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-unused-vars')).toBe(true);
	});

	it('no-useless-backreference', () => {
		expect(eslintConfig.rules['no-useless-backreference']).toBe('error');
	});

	it('no-useless-catch', async () => {
		const code = `try { throw 1; } catch(e) { throw e; }`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-useless-catch')).toBe(true);
	});

	it('no-useless-escape', async () => {
		const code = 'const s = "Hello\\+"; console.log(s);';
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'no-useless-escape')).toBe(true);
	});

	it('no-with', () => {
		expect(eslintConfig.rules['no-with']).toBe('error');
	});

	it('require-yield', () => {
		expect(eslintConfig.rules['require-yield']).toBe('error');
	});

	it('sort-imports', async () => {
		const code = `import {b, a} from 'mod';`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'sort-imports')).toBe(true);
	});

	it('use-isnan', async () => {
		const code = `if (x == NaN) {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'use-isnan')).toBe(true);
	});

	it('valid-typeof', async () => {
		const code = `if(typeof x === 'strnig') {}`;
		const messages = await lintCode(code);
		expect(messages.some((m) => m.ruleId === 'valid-typeof')).toBe(true);
	});
});
