# @opi_pib/eslint-config-base

## Install

```
npm install -D @opi_pib/eslint-config-base
```

## Config

eslint.config.mjs

### JS files

```
import config from '@opi_pib/eslint-config-base';

/** @type {import("eslint").Linter.Config} */
export default config;
```

### TS files

```
import config from '@opi_pib/eslint-config-base/ts';

/** @type {import("eslint").Linter.Config} */
export default config;
```

### Angular

eslint.config.mjs

```
import config from '@opi_pib/eslint-config-base/ts';

/** @type {import("eslint").Linter.Config} */
export default {
	...config,
	languageOptions: {
		...config.languageOptions,
		parserOptions: {
			...config.languageOptions.parserOptions,
			project: './tsconfig.eslint.json'
		}
	}
};
```

tsconfig.eslint.json

```
{
	"extends": "./tsconfig.app.json",
	"include": ["**/*.ts"],
	"exclude": []
}
```

## VS Code settings.json

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "eslint.format.enable": true
}
```
