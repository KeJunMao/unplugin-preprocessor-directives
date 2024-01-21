import { describe, expect, it } from 'vitest'
import { Lexer } from '../src'

describe('lexer', () => {
  it('should tokenize code with comments', () => {
    const code = `
      // This is a comment
      const foo = 'bar';
      // Another comment
      const baz = 'qux';`
    const expectedTokens = [
      { type: 'code', value: '// This is a comment' },
      { type: 'code', value: 'const foo = \'bar\';' },
      { type: 'code', value: '// Another comment' },
      { type: 'code', value: 'const baz = \'qux\';' },
    ]

    const tokens = Lexer.lex(code)

    expect(tokens).toEqual(expectedTokens)
  })

  it('should tokenize code without comments', () => {
    const code = `
      const foo = 'bar';
      const baz = 'qux';`
    const expectedTokens = [
      { type: 'code', value: 'const foo = \'bar\';' },
      { type: 'code', value: 'const baz = \'qux\';' },
    ]

    const tokens = Lexer.lex(code)

    expect(tokens).toEqual(expectedTokens)
  })
})
