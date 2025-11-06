import { describe, expect, it } from 'vitest'
import { Context, ifDirective } from '../src'

describe('sourcemap', () => {
  const context = new Context({
    directives: [ifDirective],
  })

  it('should generate source map with if directive', () => {
    context.env.DEV = true
    const code = `// #if DEV
console.log('DEV')
// #endif

// #if !DEV
console.log('!DEV')
// #endif
`
    const result = context.transformWithMap(code, 'test.js')
    expect(result).toBeDefined()
    expect(result?.code).toMatchSnapshot()
    expect(result?.map).toBeDefined()
    expect(result?.map.toString()).toMatchSnapshot()
  })

  it('should generate source map when condition is false', () => {
    context.env.DEV = false
    const code = `// #if DEV
console.log('DEV')
// #endif

console.log('always')
`
    const result = context.transformWithMap(code, 'test.js')
    expect(result).toBeDefined()
    expect(result?.code).toMatchSnapshot()
    expect(result?.map).toBeDefined()
  })

  it('should return undefined when no directives found', () => {
    const code = `console.log('no directives')`
    const result = context.transformWithMap(code, 'test.js')
    expect(result).toBeUndefined()
  })
})
