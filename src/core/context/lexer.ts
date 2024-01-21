/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
import type { CodeToken, Lex, SimpleToken } from '../types'

export function isComment(line: string) {
  return (
    // JS comment
    line.slice(0, 3) === '// '
    // CSS comment
    || line.slice(0, 3) === '/* '
    // HTML comment
    || line.slice(0, 5) === '<!-- '
  )
}

export class Lexer {
  current = 0
  tokens: SimpleToken[] = []
  constructor(public code: string, public lexers: Lex[] = []) {
  }

  private lex() {
    const code = this.code
    scanner:
    while (this.current < code.length) {
      const startIndex = this.current
      let endIndex = code.indexOf('\n', startIndex + 1)
      if (endIndex === -1)
        endIndex = code.length

      const line = code.slice(startIndex, endIndex).trim()
      if (isComment(line)) {
        for (const lex of this.lexers) {
          const token = lex.bind(this)(line)
          if (token) {
            this.tokens.push(token)
            this.current = endIndex
            continue scanner
          }
        }
      }
      this.tokens.push({
        type: 'code',
        value: line,
      } as CodeToken)
      this.current = endIndex
    }
    return this.tokens
  }

  static lex(code: string, lexers: Lex[] = []) {
    const lexer = new Lexer(code, lexers)
    return lexer.lex()
  }
}
