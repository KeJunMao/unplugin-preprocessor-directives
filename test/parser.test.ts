import { describe, expect, it } from 'vitest'
import { Parser } from '../src'

describe('parser', () => {
  it('should parse code statements', () => {
    const tokens = [{ type: 'code', value: 'console.log("Hello, World!")' }]
    const ast = Parser.parse(tokens)
    expect(ast.body).toHaveLength(1)
    expect(ast.body[0].type).toBe('CodeStatement')
    expect(ast.body[0].value).toBe('console.log("Hello, World!")')
  })

  it('should throw an error for unknown token type', () => {
    const tokens = [{ type: 'unknown', value: 'unknown token' }]
    expect(() => Parser.parse(tokens)).toThrowError('Parser: Unknown token type: unknown')
  })
})
