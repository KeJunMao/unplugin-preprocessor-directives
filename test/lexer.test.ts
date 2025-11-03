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
      { type: 'code', value: '\n', start: 0, end: 1 },
      { type: 'code', value: '      // This is a comment\n', start: 1, end: 28 },
      { type: 'code', value: '      const foo = \'bar\';\n', start: 28, end: 53 },
      { type: 'code', value: '      // Another comment\n', start: 53, end: 78 },
      { type: 'code', value: '      const baz = \'qux\';', start: 78, end: 102 },
    ]

    const tokens = Lexer.lex(code)

    expect(tokens).toEqual(expectedTokens)
  })

  it('should tokenize code without comments', () => {
    const code = `
      const foo = 'bar';
      const baz = 'qux';`
    const expectedTokens = [
      { type: 'code', value: '\n', start: 0, end: 1 },
      { type: 'code', value: '      const foo = \'bar\';\n', start: 1, end: 26 },
      { type: 'code', value: '      const baz = \'qux\';', start: 26, end: 50 },
    ]

    const tokens = Lexer.lex(code)

    expect(tokens).toEqual(expectedTokens)
  })
})
