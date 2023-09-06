<img src="assets/logo.svg" alt="logo" width="100" height="100" align="right" />

# unplugin-preprocessor-directives

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

[English](./README.md) | 简体中文

## 安装

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


## 使用

### 定义 symbols

您可以使用以下两个预处理器指令来定义或取消定义 symbols，以便进行条件编译：

- `#define`: 定义一个 symbol.
- `#undef`: 取消定义一个 symbol.

使用 `#define` 可以定义一个 symbol。将 symbol 作为表达式传递给 `#if` 指令时，表达式的值将为 `true`，如下例所示：

```ts
// #define VERBOSE

// #if VERBOSE
console.log('Verbose output version')
// #endif
```

> [!WARNING]
> `#define` 和 `#undef` 是提升的，类似 JavaScript 的 `var`。

### 条件编译

- `#if`: 打开条件编译，只有当指定的 symbol 被定义并求值为 true 时，代码才会被编译。
- `#elif`:关闭前面的条件编译，并判断是否定义了指定的 symbol 并求值为 true 时，打开一个新的条件编译。
- `#else`: 如果前一个指定的 symbol 未定义或求值为 false，则关闭前一个条件编译，并打开一个新的条件编译。
- `#endif`: 关闭前面的条件编译。

> [!NOTE]
> 默认情况下，使用 vite 的 `loadEnv` 函数根据`process.env.NODE_ENV` 加载环境变量并作为条件编译 symbols。

```ts
// src/index.ts

// #if DEV
console.log('Debug version')
// #endif

// #if !MYTEST
console.log('MYTEST is not defined or false')
// #endif
```

可以使用运算符 `==` （相等）和 `!=` （不等）来测试 `true` 或 `false`。`true` 表示 symbol 已定义。语句 `#if DEBUG` 与 `#if (DEBUG == true)` 意义相同。支持使用 `&&` (与)、`||` (或) 和 `!` (非) 操作符来判断是否定义了多个 symbols。还可以用括号将 symbols 和运算符分组。

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
### 错误、警告和信息提示

可以指示编译器生成用户定义的编译器错误、警告和信息。

- `#error`: 生成一条错误消息。
- `#warning`: 生成一条警告消息。
- `#info`: 生成一条信息消息。

```ts
// #error this is an error message
// #warning this is a warning message
// #info this is an info message
```

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
