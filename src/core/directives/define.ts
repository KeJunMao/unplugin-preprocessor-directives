/* eslint-disable no-new-func */
import process from 'node:process'
import { defineDirective } from '../directive'
import type { DefineStatement, DefineToken } from '../types'
import { createProgramNode, simpleMatchToken } from '../utils'

function resolveDefineNameAndValue(expression: string, env = process.env): [string, boolean] {
  if (/^\w*$/.test(expression)) {
    return [expression, true]
  }

  else {
    const evaluateExpression = new Function('env', `with (env){ return {${expression.replace('=', ':')}} }`)
    return Object.entries(evaluateExpression(env))[0] as any
  }
}

export const theDefineDirective = defineDirective<DefineToken, DefineStatement>(context => ({
  lex(comment) {
    const defineMath = comment.match(/#define\s?(.*)/)

    if (defineMath) {
      return {
        type: 'define',
        value: defineMath[1]?.trim(),
      }
    }
    const undefMatch = comment.match(/#undef\s?(\w*)/)
    if (undefMatch) {
      return {
        type: 'undef',
        value: undefMatch[1]?.trim(),
      }
    }
  },
  parse(token) {
    if (token.type === 'define' || token.type === 'undef') {
      this.current++
      return {
        type: 'DefineStatement',
        kind: token.type,
        value: token.value,
      }
    }
  },
  transform(node) {
    if (node.type === 'DefineStatement') {
      if (node.kind === 'define') {
        const [name, value] = resolveDefineNameAndValue(node.value, context.env)
        context.env[name] = value
      }
      else if (node.kind === 'undef') { context.env[node.value] = false }

      return createProgramNode()
    }
  },
  generate(node, comment) {
    if (node.type === 'DefineStatement' && comment) {
      if (node.kind === 'define')
        return `${comment.start} #${node.kind} ${node.value} ${comment.end}`

      else if (node.kind === 'undef')
        return `${comment.start} #${node.kind} ${node.value} ${comment.end}`
    }
  },
}))
