import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Context, ifDirective, includeDirective, theDefineDirective } from '../src'

describe('include', () => {
  const root = resolve(__dirname, './fixtures')
  const context = new Context({
    cwd: root,
    // @ts-expect-error ignore
    directives: [includeDirective, ifDirective, theDefineDirective],
  })

  it('should include a simple file', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')
    context.env.DEV = false
    const result = context.transform(code, resolve(root, 'include-main.txt'))
    expect(result).toBeDefined()
    expect(result).toContain('baseValue')
    expect(result).toMatchSnapshot()
  })

  it('should process directives in included files (DEV=true)', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')
    context.env.DEV = true
    const result = context.transform(code, resolve(root, 'include-main.txt'))
    expect(result).toBeDefined()
    expect(result).toContain('devMode = true')
    expect(result).not.toContain('devMode = false')
    expect(result).toMatchSnapshot()
  })

  it('should process directives in included files (DEV=false)', () => {
    const code = readFileSync(resolve(root, 'include-main.txt'), 'utf-8')
    context.env.DEV = false
    const result = context.transform(code, resolve(root, 'include-main.txt'))
    expect(result).toBeDefined()
    expect(result).toContain('devMode = false')
    expect(result).not.toContain('devMode = true')
    expect(result).toMatchSnapshot()
  })

  it('should handle non-existent files gracefully', () => {
    const code = `// #include "non-existent-file.txt"\nconst test = 'test';`
    const result = context.transform(code, 'test.js')
    expect(result).toBeDefined()
    expect(result).toContain('const test')
  })

  it('should detect and prevent circular includes', () => {
    const code = readFileSync(resolve(root, 'include-circular-a.txt'), 'utf-8')
    const result = context.transform(code, resolve(root, 'include-circular-a.txt'))
    expect(result).toBeDefined()
    // 应该包含 fileA 和 fileB，但不会无限循环
    expect(result).toContain('fileA')
    expect(result).toContain('fileB')
  })
})
