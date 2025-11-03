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

      // 使用正则表达式匹配换行符，更优雅地处理各种换行符类型
      const newlineMatch = code.slice(startIndex).match(/(\r\n|\n|\r)/)

      let endIndex: number
      let nextIndex: number
      let newlineChar: string | undefined

      if (newlineMatch) {
        newlineChar = newlineMatch[0]
        endIndex = startIndex + newlineMatch.index!
        nextIndex = endIndex + newlineChar.length
      }
      else {
        // 没有找到换行符，说明是最后一行
        endIndex = code.length
        nextIndex = code.length
      }

      // 获取原始行内容，对于 code 类型，我们需要包含换行符
      const rawLine = code.slice(startIndex, nextIndex)
      const lineWithoutNewline = code.slice(startIndex, endIndex).trim()

      if (isComment(lineWithoutNewline)) {
        for (const lex of this.lexers) {
          const comment = parseComment(lineWithoutNewline)

          const token = lex.bind(this)(comment.content!)
          if (token) {
            this.tokens.push({
              comment: comment.type,
              start: startIndex,
              end: nextIndex,
              ...token,
            })
            this.current = nextIndex
            continue scanner
          }
        }
      }

      // 对于 code 类型,保留原始行内容(包括换行符)
      this.tokens.push({
        type: 'code',
        value: rawLine,
        start: startIndex,
        end: nextIndex,
      } as CodeToken)
      this.current = nextIndex
    }
    return this.tokens
  }

  static lex(code: string, lexers: Lex[] = []) {
    const lexer = new Lexer(code, lexers)
    return lexer.lex()
  }
}
