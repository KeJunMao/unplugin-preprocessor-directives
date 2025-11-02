/* eslint-disable no-labels */
import type { CodeToken, Lex, SimpleToken } from '../types'
import { isComment, parseComment } from '../utils'

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
      // 查找最近的换行符(\r\n, \n, \r)
      const nextCR = code.indexOf('\r', startIndex)
      const nextLF = code.indexOf('\n', startIndex)
      let endIndex: number

      if (nextCR === -1 && nextLF === -1) {
        // 没有找到换行符，说明是最后一行
        endIndex = code.length
      }
      else if (nextCR === -1) {
        // 只有 \n
        endIndex = nextLF
      }
      else if (nextLF === -1) {
        // 只有 \r
        endIndex = nextCR
      }
      else if (nextCR < nextLF) {
        // 如果是 \r\n，跳过 \n
        endIndex = nextCR
        if (nextLF === nextCR + 1) {
          endIndex += 2
        }
      }
      else {
        // \n
        endIndex = nextLF
      }

      const rawLine = code.slice(startIndex, endIndex)
      const line = rawLine.trim()
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
        value: rawLine,
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
