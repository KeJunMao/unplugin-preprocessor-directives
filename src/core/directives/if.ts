import process from 'node:process'
import { defineDirective } from '../directive'

function resolveConditional(test: string, env = process.env) {
  test = test || 'true'
  test = test.trim()
  test = test.replace(/([^=!])=([^=])/g, '$1==$2')
  // eslint-disable-next-line no-new-func
  const evaluateCondition = new Function('env', `with (env){ return ( ${test} ) }`)

  try {
    return evaluateCondition(env)
  }
  catch (error) {
    if (error instanceof ReferenceError) {
      const match = error.message.match(/(.*?) is not defined/g)
      if (match) {
        const name = match[1]
        // @ts-expect-error ignore
        env[name] = false
        return resolveConditional(test, env)
      }
    }
    return false
  }
}

export default defineDirective({
  name: '#if',
  nested: true,
  pattern: {
    start: /.*?#if\s([\w !=&|()'"]*).*[\r\n]{1,2}/gm,
    end: /\s*.*?#endif.*?$/gm,
  },
  processor({ matchGroup, replace, ctx }) {
    const code = replace(matchGroup.match)
    const regex = /.*?(#el(?:if|se))\s?([\w !=&|()'"]*).*[\r\n]{1,2}/gm
    const codeBlock = [
      '#if',
      matchGroup.left?.[1] || '',
      ...ctx.XRegExp.split(code, regex),
    ].map(v => v.trim())

    while (codeBlock.length) {
      const [variant, conditional, block] = codeBlock.splice(0, 3)
      if (variant === '#if' || variant === '#elif') {
        if (resolveConditional(conditional, ctx.env))
          return block
      }
      else if (variant === '#else') {
        return block
      }
    }
    return code
  },
})
