import type { CodeStatement, Parse, SimpleToken } from '../types'
import { createProgramNode } from '../utils'

export class Parser {
  ast = createProgramNode()
  current = 0
  constructor(public tokens: SimpleToken[], public parsers: Parse[] = []) {
  }

  walk() {
    const token = this.tokens[this.current]

    if (token.type === 'code') {
      this.current++
      return {
        type: 'CodeStatement',
        value: token.value,
        start: token.start,
        end: token.end,
      } as CodeStatement
    }

    for (const parser of this.parsers) {
      const node = parser.bind(this)(token)
      if (node) {
        return {
          comment: token.comment,
          start: token.start,
          end: token.end,
          ...node,
        }
      }
    }

    throw new Error(`Parser: Unknown token type: ${token.type}`)
  }

  private parse() {
    while (this.current < this.tokens.length)
      this.ast.body.push(this.walk())

    return this.ast
  }

  static parse(tokens: SimpleToken[], parsers: Parse[] = []) {
    const parser = new Parser(tokens, parsers)
    return parser.parse()
  }
}
