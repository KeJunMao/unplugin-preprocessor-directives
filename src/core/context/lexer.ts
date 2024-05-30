/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
import { isComment, parseComment } from '../utils'
import type { CodeToken, Lex, SimpleToken } from '../types'

export class Lexer {
  current = 0
  tokens: SimpleToken[] = []
  constructor(public code: string, public lexers: Lex[] = []) {
  }

  private lex() {
    const code = this.code
    let inPreTag = false
    scanner:
    while (this.current < code.length) {
      const startIndex = this.current
      let endIndex = code.indexOf('\n', startIndex + 1)
      if (endIndex === -1)
        endIndex = code.length

      const lineWithWhiteSpace = code.slice(startIndex, endIndex)
      const line = code.slice(startIndex, endIndex).trim()

      if (line.includes('<pre>'))
        inPreTag = true
      else if (line.includes('</pre>'))
        inPreTag = false

      if (isComment(line)) {
        for (const lex of this.lexers) {
          const comment = parseComment(line)

          const token = lex.bind(this)(comment.content!)
          if (token) {
            this.tokens.push({ comment: comment.type, ...token })
            this.current = endIndex
            continue scanner
          }
        }
      }
      this.tokens.push({
        type: 'code',
        // filter pre tag
        value: inPreTag ? lineWithWhiteSpace.replace('\n', '') : line,
        // value: line,
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
