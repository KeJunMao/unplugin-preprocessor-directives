import process from 'node:process'
import { defineDirective } from '../directive'
import type { IfStatement, IfToken } from '../types'
import { simpleMatchToken } from '../utils'

export function resolveConditional(test: string, env = process.env) {
  test = test || 'true'
  test = test.trim()
  test = test.replace(/([^=!])=([^=])/g, '$1==$2')
  // eslint-disable-next-line no-new-func
  const evaluateCondition = new Function('env', `with (env){ return ( ${test} ) }`)

  try {
    return evaluateCondition(env) === 'false' ? false : !!evaluateCondition(env)
  }
  catch (error) {
    if (error instanceof ReferenceError) {
      const match = /(\w*?) is not defined/g.exec(error.message)
      if (match && match[1]) {
        const name = match[1]
        // @ts-expect-error ignore
        env[name] = false
        return resolveConditional(test, env)
      }
    }
    return false
  }
}

export const ifDirective = defineDirective<IfToken, IfStatement>((context) => {
  return {
    lex(comment) {
      return simpleMatchToken(comment, /#(if|else|elif|endif)\s*(.*)/)
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
    transform(node) {
      if (node.type === 'IfStatement') {
        if (resolveConditional(node.test, context.env)) {
          return {
            type: 'Program',
            body: node.consequent.map(this.walk.bind(this)).filter(n => n != null),
          }
        }
        else if (node.alternate) {
          return {
            type: 'Program',
            body: node.alternate.map(this.walk.bind(this)).filter(n => n != null),
          }
        }
      }
    },
    generate(node) {
      if (node.type === 'IfStatement') {
        let code = ''
        if (node.kind === 'else')
          code = '// #else'

        else
          code = `// #${node.kind} ${node.test}`

        const consequentCode = node.consequent.map(this.walk.bind(this)).join('\n')
        code += `\n${consequentCode}`
        if (node.alternate.length) {
          const alternateCode = node.alternate.map(this.walk.bind(this)).join('\n')
          code += `\n${alternateCode}`
        }
        else {
          code += '\n// #endif'
        }
        return code
      }
    },
  }
})
