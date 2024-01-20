import { describe, expect, it } from 'vitest'
import _IfDirective from '../../src/core/directives/if'
import { IfToken, Lexer, ObjectDirective, Parser, SimpleToken } from '../../src'

describe('IfDirective', () => {
  const IfDirective = _IfDirective as ObjectDirective
  it('should lex if token', () => {
    const comment = '// #if condition'
    const expectedToken: SimpleToken[] = [{
      type: 'if',
      value: 'condition',
    }]

    const token = Lexer.lex(comment, [IfDirective.lex])

    expect(token).toEqual(expectedToken)
  })

  it('should lex else token', () => {
    const comment = '// #else'
    const expectedToken: SimpleToken[] = [{
      type: 'else',
      value: '',
    }]

    const token = Lexer.lex(comment, [IfDirective.lex])

    expect(token).toEqual(expectedToken)
  })

  it('should lex elif token', () => {
    const comment = '// #elif condition'
    const expectedToken: SimpleToken[] = [{
      type: 'elif',
      value: 'condition',
    }]

    const token = Lexer.lex(comment, [IfDirective.lex])

    expect(token).toEqual(expectedToken)
  })

  it('should lex endif token', () => {
    const comment = '// #endif'
    const expectedToken: SimpleToken[] = [
      {
        type: 'endif',
        value: '',
      }
    ]

    const token = Lexer.lex(comment, [IfDirective.lex])

    expect(token).toEqual(expectedToken)
  })

  it('should parse if statement', () => {
    const tokens: IfToken[] = [
      { type: 'if', value: 'condition' },
      { type: 'elif', value: 'condition2' },
      { type: 'else', value: '' },
      { type: 'endif', value: '' },
    ]

    const statement = Parser.parse(tokens, [IfDirective.parse])

    expect(statement).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "alternate": [
              {
                "alternate": [
                  {
                    "alternate": [],
                    "consequent": [],
                    "kind": "else",
                    "test": "",
                    "type": "IfStatement",
                  },
                ],
                "consequent": [],
                "kind": "elif",
                "test": "condition2",
                "type": "IfStatement",
              },
            ],
            "consequent": [],
            "kind": "if",
            "test": "condition",
            "type": "IfStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })
})
