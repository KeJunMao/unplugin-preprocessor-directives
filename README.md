<img src="assets/logo.svg" alt="logo" width="100" height="100" align="right" />

# unplugin-preprocessor-directives

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

English | [简体中文](./README.zh-cn.md)

## Install

```bash
npm i unplugin-preprocessor-directives
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import PreprocessorDirectives from 'unplugin-preprocessor-directives/vite'

export default defineConfig({
  plugins: [
    PreprocessorDirectives({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import PreprocessorDirectives from 'unplugin-preprocessor-directives/rollup'

export default {
  plugins: [
    PreprocessorDirectives({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-preprocessor-directives/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-preprocessor-directives/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-preprocessor-directives/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import PreprocessorDirectives from 'unplugin-preprocessor-directives/esbuild'

build({
  plugins: [PreprocessorDirectives()],
})
```

<br></details>

<details>
<summary>Rspack (⚠️ experimental)</summary><br>

```ts
// rspack.config.js
module.exports = {
  plugins: [
    require('unplugin-preprocessor-directives/rspack')({ /* options */ }),
  ],
}
```

<br></details>

## Usage

### Defining symbols

You use the following two preprocessor directives to define or undefine symbols for conditional compilation:

- `#define`: Define a symbol.
- `#undef`: Undefine a symbol.

You use `#define` to define a symbol. When you use the symbol as the expression that's passed to the `#if` directive, the expression will evaluate to `true`, as the following example shows:

```ts
// #define VERBOSE

// #if VERBOSE
console.log('Verbose output version')
// #endif
```

### Conditional compilation

- `#if`: Opens a conditional compilation, where code is compiled only if the specified symbol is defined and evaluated to true.
- `#elif`: Closes the preceding conditional compilation and opens a new conditional compilation based on if the specified symbol is defined and evaluated to true.
- `#else`: Closes the preceding conditional compilation and opens a new conditional compilation if the previous specified symbol isn't defined or evaluated to false.
- `#endif`: Closes the preceding conditional compilation.

> [!NOTE]
> By default, use vite's `loadEnv` function to load environment variables based on `process.env.NODE_ENV` and compile symbols as conditions.

```ts
// src/index.ts

// #if DEV
console.log('Debug version')
// #endif

// #if !MYTEST
console.log('MYTEST is not defined or false')
// #endif
```

You can use the operators `==` (equality) and `!=` (inequality) to test for the bool values `true` or `false`. `true` means the symbol is defined. The statement `#if DEBUG` has the same meaning as `#if (DEBUG == true)`. You can use the `&&` (and), `||` (or), and `!` (not) operators to evaluate whether multiple symbols have been defined. You can also group symbols and operators with parentheses.

```ts
class MyClass {
  constructor() {
    // #if (DEBUG && MYTEST)
    console.log('DEBUG and MYTEST are defined')
    // #elif (DEBUG==false && !MYTEST)
    console.log('DEBUG and MYTEST are not defined')
    // #endif
  }
}
```
### Error and warning and info messages

You instruct the compiler to generate user-defined compiler errors and warnings and informational messages.

- `#error`: Generates an error.
- `#warning`: Generates a warning.
- `#info`: Generates an informational message.

```ts
// #error this is an error message
// #warning this is a warning message
// #info this is an info message
```
## Custom directive

You can used `defineDirective` to define your own directive.

Taking the built-in directive as an example:

```ts
export const MessageDirective = defineDirective<MessageToken, MessageStatement>(context => ({
  lex(comment) {
    return simpleMatchToken(comment, /#(error|warning|info)\s*(.*)/)
  },
  parse(token) {
    if (token.type === 'error' || token.type === 'warning' || token.type === 'info') {
      this.current++
      return {
        type: 'MessageStatement',
        kind: token.type,
        value: token.value,
      }
    }
  },
  transform(node) {
    if (node.type === 'MessageStatement') {
      switch (node.kind) {
        case 'error':
          context.logger.error(node.value, { timestamp: true })
          break
        case 'warning':
          context.logger.warn(node.value, { timestamp: true })
          break
        case 'info':
          context.logger.info(node.value, { timestamp: true })
          break
      }
      return createProgramNode()
    }
  },
  generate(node, comment) {
    if (node.type === 'MessageStatement' && comment)
      return `${comment.start} #${node.kind} ${node.value} ${comment.end}`
  },
}))
export const MessageDirective = defineDirective<MessageToken, MessageStatement>(context => ({
  lex(comment) {
    return simpleMatchToken(comment, /#(error|warning|info)\s*(.*)/)
  },
  parse(token) {
    if (token.type === 'error' || token.type === 'warning' || token.type === 'info') {
      this.current++
      return {
        type: 'MessageStatement',
        kind: token.type,
        value: token.value,
      }
    }
  },
  transform(node) {
    if (node.type === 'MessageStatement') {
      switch (node.kind) {
        case 'error':
          context.logger.error(node.value, { timestamp: true })
          break
        case 'warning':
          context.logger.warn(node.value, { timestamp: true })
          break
        case 'info':
          context.logger.info(node.value, { timestamp: true })
          break
      }
      return createProgramNode()
    }
  },
  generate(node, comment) {
    if (node.type === 'MessageStatement' && comment)
      return `${comment.start} #${node.kind} ${node.value} ${comment.end}`
  },
}))
```

### `enforce: 'pre' | 'post'`

Execution priority of directives

- `pre`: Execute as early as possible
- `post`: Execute as late as possible

[npm-version-src]: https://img.shields.io/npm/v/unplugin-preprocessor-directives?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/unplugin-preprocessor-directives
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-preprocessor-directives?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/unplugin-preprocessor-directives
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unplugin-preprocessor-directives?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=unplugin-preprocessor-directives
[license-src]: https://img.shields.io/github/license/kejunmao/unplugin-preprocessor-directives.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/kejunmao/unplugin-preprocessor-directives/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/unplugin-preprocessor-directives
