import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Context, theDefineDirective } from '../src'

describe('define', () => {
  const root = resolve(__dirname, './fixtures')
  const context = new Context({
    // @ts-expect-error ignore
    directives: [theDefineDirective],
  })

  it('should define env', () => {
    const code = readFileSync(resolve(root, 'define.txt'), 'utf-8')
    context.transform(code, 'define.txt')

    expect(context.env.html).toBeTruthy()
    expect(context.env.css).toBeTruthy()
    expect(context.env.js).toBeTruthy()
    expect(context.env.DEV).toBe('2')
  })
  it('should undef env', () => {
    const code = readFileSync(resolve(root, 'undef.txt'), 'utf-8')
    context.transform(code, 'undef.txt')

    expect(context.env.html).toBeFalsy()
    expect(context.env.css).toBeFalsy()
    expect(context.env.js).toBeFalsy()
    expect(context.env.DEV).toBeFalsy()
  })
})
