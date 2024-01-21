import { defineDirective } from "../directive";
import { DefineStatement, DefineToken } from "../types";
import { createProgramNode, simpleMatchToken } from "../utils";

export const theDefineDirective = defineDirective<DefineToken, DefineStatement>((context) => ({
  lex(comment) {
    return simpleMatchToken(comment, /#(define|undef)\s*(.*)/)
  },
  parse(token) {
    if (token.type === 'define' || token.type === 'undef') {
      this.current++
      return {
        type: 'DefineStatement',
        kind: token.type,
        name: token.value,
      }
    }
  },
  transform(node) {
    if (node.type === 'DefineStatement') {
      if (node.kind === 'define') {
        context.env[node.name] = true
      }
      else if (node.kind === 'undef') {
        context.env[node.name] = false
      }
      return createProgramNode()
    }
  },
  generate(node) {
    if (node.type === 'DefineStatement') {
      if (node.kind === 'define') {
        return `#${node.kind} ${node.name}`
      }
      else if (node.kind === 'undef') {
        return `#${node.kind} ${node.name}`
      }
    }
  }
}))
