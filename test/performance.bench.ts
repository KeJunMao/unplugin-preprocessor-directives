import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { bench, describe } from 'vitest'
import { Context, ifDirective, includeDirective, MessageDirective, theDefineDirective } from '../src'

describe('benchmark', () => {
  const root = resolve(__dirname, './fixtures')

  const context = new Context({
    directives: [ifDirective, theDefineDirective, includeDirective, MessageDirective],
    cwd: root,
  })

  bench('transform simple code', () => {
    const code = `
      #define DEV 1
      #if DEV
        console.log('development')
      #endif
    `
    context.transform(code, 'test.js')
  })

  bench('transform complex code', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')

    context.transform(code, 'test.js')
  })
})
