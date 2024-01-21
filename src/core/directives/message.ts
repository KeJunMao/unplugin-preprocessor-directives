import { defineDirective } from "../directive";
import { MessageToken, MessageStatement } from "../types";
import { createProgramNode, simpleMatchToken } from "../utils";

export const MessageDirective = defineDirective<MessageToken, MessageStatement>((context) => ({
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
          break;
        case 'warning':
          context.logger.warn(node.value, { timestamp: true })
          break;
        case 'info':
          context.logger.info(node.value, { timestamp: true })
          break;
      }
      return createProgramNode()
    }
  },
  generate(node) {
    if (node.type === 'MessageStatement') {
      return `#${node.kind} ${node.value}`
    }
  }
}))
