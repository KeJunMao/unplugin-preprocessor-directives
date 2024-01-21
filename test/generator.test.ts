import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Generator } from '../src/core/context/generator'
import { Context, Lexer, Parser } from '../src'

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

  it('should generate code without transform', () => {
    const ctx = new Context()
    const code = readFileSync(resolve(__dirname, './fixtures/if.html'), 'utf-8')
    const tokens = Lexer.lex(code, ctx.lexers)
    const ast = Parser.parse(tokens, ctx.parsers)
    const generated = Generator.generate(ast, ctx.generates)
    expect(generated.replaceAll(/\s/g, '')).toBe(code.replaceAll(/\s/g, ''))
  })

  it('should throw an error for unknown node type', () => {
    const node = {
      type: 'UnknownNode',
      value: 'console.log("Hello, World!");',
    }
    expect(() => Generator.generate(node)).toThrowError('Generator: Unknown node type: UnknownNode')
  })
})
