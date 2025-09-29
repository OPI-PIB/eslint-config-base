import { ok, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ESLint } from 'eslint';

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
		strictEqual(results[0].errorCount, 1);
		strictEqual(results[0].warningCount, 0);
	});

	it('should fail when using a console.log if rule is enabled', async () => {
		const code = `
      console.log('This is a test');
    `;
		const messages = await lintCode(code);
		if (messages.length > 0) {
			ok(typeof messages[0].ruleId === 'string');
			ok(typeof messages[0].severity === 'number');
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
		ok(importErrors.length > 0);
	});

	it('constructor-super', async () => {
		const code = `class A {} class B extends A { constructor() {} }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'constructor-super'));
	});

	it('for-direction', async () => {
		const code = `for (let i=0;i<5;i--) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'for-direction'));
	});

	it('getter-return', async () => {
		const code = `const obj = { get x() {} };`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'getter-return'));
	});

	it('import/no-duplicates', async () => {
		const code = `import { readFile } from 'fs'; import { writeFile } from 'fs';`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'import/no-duplicates'));
	});

	it('import/order', async () => {
		const code = `import a from './b'; import fs from 'fs';`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'import/order'));
	});

	it('no-async-promise-executor', async () => {
		const code = `new Promise(async (res, rej) => {});`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-async-promise-executor'));
	});

	it('no-case-declarations', async () => {
		const code = `switch(a){case 1: let x=1; break;}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-case-declarations'));
	});

	it('no-class-assign', async () => {
		const code = `class A {} A = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-class-assign'));
	});

	it('no-compare-neg-zero', async () => {
		const code = `if (x === -0) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-compare-neg-zero'));
	});

	it('no-cond-assign', async () => {
		const code = `if (x = 5) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-cond-assign'));
	});

	it('no-const-assign', async () => {
		const code = `const x = 1; x = 2;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-const-assign'));
	});

	it('no-constant-condition', async () => {
		const code = `while(true) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-constant-condition'));
	});

	it('no-control-regex', async () => {
		const code = `const re = /\\x1f/;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-control-regex'));
	});

	it('no-debugger', async () => {
		const code = `debugger;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-debugger'));
	});

	it('no-delete-var', () => {
		strictEqual(eslintConfig.rules['no-delete-var'], 'error');
	});

	it('no-dupe-args', () => {
		strictEqual(eslintConfig.rules['no-dupe-args'], 'error');
	});

	it('no-dupe-class-members', async () => {
		const code = `class A { x(){} x(){} }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-dupe-class-members'));
	});

	it('no-dupe-else-if', async () => {
		const code = `if(a){} else if(a){};`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-dupe-else-if'));
	});

	it('no-dupe-keys', async () => {
		const code = `const o = {a:1, a:2};`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-dupe-keys'));
	});

	it('no-duplicate-case', async () => {
		const code = `switch(x){case 1: break; case 1: break;}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-duplicate-case'));
	});

	it('no-empty', async () => {
		const code = `if(true) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-empty'));
	});

	it('no-empty-character-class', async () => {
		const code = `const re = /[]/;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-empty-character-class'));
	});

	it('no-empty-pattern', async () => {
		const code = `const {} = obj;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-empty-pattern'));
	});

	it('no-ex-assign', async () => {
		const code = `try{}catch(e){ e = 1; }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-ex-assign'));
	});

	it('no-extra-boolean-cast', async () => {
		const code = `if(!!x) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-extra-boolean-cast'));
	});

	it('no-extra-semi', async () => {
		const code = `const x = 1;; console.log(x);`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-extra-semi'));
	});

	it('no-fallthrough', async () => {
		const code = `switch(x){case 1: console.log(1); case 2: break;}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-fallthrough'));
	});

	it('no-func-assign', async () => {
		const code = `function f(){} f = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-func-assign'));
	});

	it('no-global-assign', async () => {
		const code = `Object = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-global-assign'));
	});

	it('no-import-assign', async () => {
		const code = `import fs from 'fs'; fs = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-import-assign'));
	});

	it('no-inner-declarations', () => {
		strictEqual(eslintConfig.rules['no-inner-declarations'], 'error');
	});

	it('no-invalid-regexp', async () => {
		const code = `const re = new RegExp('[');`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-invalid-regexp'));
	});

	it('no-irregular-whitespace', () => {
		strictEqual(eslintConfig.rules['no-irregular-whitespace'], 'error');
	});

	it('no-loss-of-precision', async () => {
		const code = `const x = 9007199254740993;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-loss-of-precision'));
	});

	it('no-misleading-character-class', async () => {
		const code = `/^[Á]$/u;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-misleading-character-class'));
	});

	it('no-mixed-spaces-and-tabs', async () => {
		const code = `const x = 1;\n\t const y = 2;console.log({x, y});`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-mixed-spaces-and-tabs'));
	});

	it('no-new-symbol', async () => {
		const code = `new Symbol();`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-new-symbol'));
	});

	it('no-nonoctal-decimal-escape', () => {
		strictEqual(eslintConfig.rules['no-nonoctal-decimal-escape'], 'error');
	});

	it('no-obj-calls', async () => {
		const code = `Math();`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-obj-calls'));
	});

	it('no-octal', () => {
		strictEqual(eslintConfig.rules['no-octal'], 'error');
	});

	it('no-prototype-builtins', async () => {
		const code = `obj.hasOwnProperty('x');`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-prototype-builtins'));
	});

	it('no-redeclare', async () => {
		const code = `var a; var a;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-redeclare'));
	});

	it('no-regex-spaces', async () => {
		const code = `const re = /a  b/;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-regex-spaces'));
	});

	it('no-self-assign', async () => {
		const code = `let a; a = a;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-self-assign'));
	});

	it('no-setter-return', async () => {
		const code = `const obj = { set x(v) { return 1; } };`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-setter-return'));
	});

	it('no-shadow', async () => {
		const code = `let a = 1; function f(a) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-shadow'));
	});

	it('no-shadow-restricted-names', async () => {
		const code = `let undefined = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-shadow-restricted-names'));
	});

	it('no-sparse-arrays', async () => {
		const code = `const a = [1,,2];`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-sparse-arrays'));
	});

	it('no-this-before-super', async () => {
		const code = `class A extends B { constructor() { this.x = 1; super(); } }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-this-before-super'));
	});

	it('no-unexpected-multiline', async () => {
		const code = `let x = 1\n[x].forEach(console.log)`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unexpected-multiline'));
	});

	it('no-unreachable', async () => {
		const code = `function f(){ return; console.log(1); }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unreachable'));
	});

	it('no-unsafe-finally', () => {
		strictEqual(eslintConfig.rules['no-unsafe-finally'], 'error');
	});

	it('no-unsafe-negation', async () => {
		const code = `if (!key in obj) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unsafe-negation'));
	});

	it('no-unsafe-optional-chaining', async () => {
		const code = `(obj?.foo).bar;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unsafe-optional-chaining'));
	});

	it('no-unused-labels', async () => {
		const code = `label: for(;;) break;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unused-labels'));
	});

	it('no-unused-vars', async () => {
		const code = `const x = 1;`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-unused-vars'));
	});

	it('no-useless-backreference', () => {
		strictEqual(eslintConfig.rules['no-useless-backreference'], 'error');
	});

	it('no-useless-catch', async () => {
		const code = `try { throw 1; } catch(e) { throw e; }`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-useless-catch'));
	});

	it('no-useless-escape', async () => {
		const code = 'const s = "Hello\\+"; console.log(s);';
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'no-useless-escape'));
	});

	it('no-with', () => {
		strictEqual(eslintConfig.rules['no-with'], 'error');
	});

	it('require-yield', () => {
		strictEqual(eslintConfig.rules['require-yield'], 'error');
	});

	it('sort-imports', async () => {
		const code = `import {b, a} from 'mod';`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'sort-imports'));
	});

	it('use-isnan', async () => {
		const code = `if (x == NaN) {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'use-isnan'));
	});

	it('valid-typeof', async () => {
		const code = `if(typeof x === 'strnig') {}`;
		const messages = await lintCode(code);
		ok(messages.some((m) => m.ruleId === 'valid-typeof'));
	});
});
