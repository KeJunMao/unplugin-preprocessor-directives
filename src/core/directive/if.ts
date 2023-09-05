import process from 'node:process'
import { defineDirective } from '.'

function resolveConditional(test: string, env = process.env) {
  test = test || 'true'
  test = test.trim()
  test = test.replace(/([^=!])=([^=])/g, '$1==$2')

  // eslint-disable-next-line no-new-func
  const evaluateCondition = new Function(
    'env',
    `with (env||{}){ return ( ${test} ); }`,
  )

  try {
    return evaluateCondition(env)
  }
  catch (error) {
    return false
  }
}

export default defineDirective(() => {
  return {
    nested: true,
    pattern: {
      start: /#if\s(.*?)[\r\n]/gm,
      end: /\s*.*?#endif.*?$/gm,
    },
    processor({ matchGroup, replace, ctx }) {
      const code = replace(matchGroup.match)
      const regex = /(#el(?:if|se))\s(.*?)[\r\n]/gm
      const codeBlock = [
        '#if',
        matchGroup.left?.[1] || '',
        ...ctx.XRegExp.split(code, regex),
      ]

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
  }
})
