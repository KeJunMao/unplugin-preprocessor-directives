import { defineDirective } from '../directive'
import { IfStatement, IfToken } from '../types'

export default defineDirective<IfToken, IfStatement>({
  lex(comment: string) {
    const match = comment.match(/#(if|else|elif|endif)\s*(.*)/)
    if (match) {
      return {
        type: match[1],
        value: match[2]?.trim(),
      } as IfToken
    }
  },
  parse(token) {
    if (token.type === 'if' || token.type === 'elif' || token.type === 'else') {
      const node: IfStatement = {
        type: 'IfStatement',
        test: token.value,
        consequent: [],
        alternate: [],
        kind: token.type,
      }
      this.current++

      while (this.current < this.tokens.length) {
        const nextToken = this.tokens[this.current]

        if (nextToken.type === 'elif' || nextToken.type === 'else') {
          node.alternate.push(this.walk())
          break
        }
        else if (nextToken.type === 'endif') {
          this.current++ // Skip 'endif'
          break
        }
        else {
          node.consequent.push(this.walk())
        }
      }
      return node
    }
  },
})
