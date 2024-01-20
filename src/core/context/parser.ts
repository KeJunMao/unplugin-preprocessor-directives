import { CodeStatement, Parse, ProgramNode, SimpleToken } from '../types'

export class Parser {
  ast: ProgramNode = { type: 'Program', body: [] }
  current = 0
  constructor(public tokens: SimpleToken[], public parsers: Parse[] = []) {
  }

  walk() {
    const token = this.tokens[this.current]

    if (token.type === 'code') {
      this.current++
      return { type: 'CodeStatement', value: token.value } as CodeStatement
    }

    for (let parser of this.parsers) {
      const node = parser.bind(this)(token)
      if (node) {
        return node
      }
    }

    throw new Error(`Unknown token type: ${token.type}`)
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
