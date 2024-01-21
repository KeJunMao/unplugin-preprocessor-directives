import { describe, expect, it } from 'vitest'
import { Generator } from '../src/core/context/generator'

describe('generator', () => {
  it('should generate code for Program node', () => {
    const node = {
      type: 'Program',
      body: [
        { type: 'CodeStatement', value: 'console.log("Hello, World!");' },
        { type: 'CodeStatement', value: 'console.log("Hello, KeJun");' },
      ],
    }
    const result = Generator.generate(node)
    expect(result).toBe('console.log("Hello, World!");\nconsole.log("Hello, KeJun");')
  })

  it('should generate code for CodeStatement node', () => {
    const node = {
      type: 'CodeStatement',
      value: 'console.log("Hello, World!");',
    }
    const result = Generator.generate(node)
    expect(result).toBe('console.log("Hello, World!");')
  })

  it('should throw an error for unknown node type', () => {
    const node = {
      type: 'UnknownNode',
      value: 'console.log("Hello, World!");',
    }
    expect(() => Generator.generate(node)).toThrowError('Generator: Unknown node type: UnknownNode')
  })
})
