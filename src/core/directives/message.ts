import type { MessageStatement, MessageToken } from '../types'
import { defineDirective } from '../directive'
import { createProgramNode, simpleMatchToken } from '../utils'

export const MessageDirective = defineDirective<MessageToken, MessageStatement>(context => ({
  lex(comment) {
    return simpleMatchToken(comment, /#(error|warning|info)\s*(.*)/)
  },
  parse(token) {
    if (token.type === 'error' || token.type === 'warning' || token.type === 'info') {
      this.current++
      return {
        type: 'MessageStatement',
        kind: token.type,
        value: token.value,
      }
    }
  },
  transform(node) {
    if (node.type === 'MessageStatement') {
      switch (node.kind) {
        case 'error':
          context.logger.error(node.value, { timestamp: true })
          break
        case 'warning':
          context.logger.warn(node.value, { timestamp: true })
          break
        case 'info':
          context.logger.info(node.value, { timestamp: true })
          break
      }
      return createProgramNode()
    }
  },
  generate(node, comment) {
    if (node.type === 'MessageStatement' && comment)
      return `${comment.start} #${node.kind} ${node.value} ${comment.end}`
  },
}))
