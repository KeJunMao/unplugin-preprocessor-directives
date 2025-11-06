import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  Context,
  ifDirective,
  includeDirective,
  MessageDirective,
  theDefineDirective,
} from '../src'

describe('performance', () => {
  const root = resolve(__dirname, './fixtures')

  const context = new Context({
    directives: [ifDirective, theDefineDirective, includeDirective, MessageDirective],
    cwd: root,
  })

  it.skip('should transform quickly', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      context.transform(code, 'test.js')
    }
    const end = performance.now()
    const duration = end - start

    // Expect it to take less than 100ms for 100 transforms
    expect(duration).toBeLessThan(100)
  })

  it.skip('should not consume excessive memory', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')

    const initialMemory = process.memoryUsage().heapUsed
    for (let i = 0; i < 10000; i++) {
      context.transform(code, 'test.js')
    }
    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory

    // Expect memory increase to be less than 10MB
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})
