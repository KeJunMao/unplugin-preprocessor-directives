# unplugin-preprocessor-directives

[![NPM version](https://img.shields.io/npm/v/unplugin-preprocessor-directives?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-preprocessor-directives)

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


## Usage

### Defining symbols

You use the following two preprocessor directives to define or undefine symbols for conditional compilation:

- `#define`: Define a symbol.
- `#undef`: Undefine a symbol.

You use `#define` to define a symbol. When you use the symbol as the expression that's passed to the `#if` directive, the expression will evaluate to true, as the following example shows:

```ts
// #define VERBOSE

// #if VERBOSE
console.log('Verbose output version')
// #endif
```

> [!WARNING]
> `#define` and `#undef` are Hoisting, which means they will be defined at the top level.

### Conditional compilation

- `#if`: Opens a conditional compilation, where code is compiled only if the specified symbol is defined and evaluated to true.
- `#elif`: Closes the preceding conditional compilation and opens a new conditional compilation based on if the specified symbol is defined and evaluated to true.
- `#else`: Closes the preceding conditional compilation and opens a new conditional compilation if the previous specified symbol isn't defined or evaluated to false.
- `#endif`: Closes the preceding conditional compilation.

> [!NOTE]
> By default, it uses the loadEnv function of vite to load the environment (by `process.env.NODE_ENV`) as a conditional compilation symbol.

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
