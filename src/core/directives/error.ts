import { relative } from 'node:path'
import type { NamedGroupsArray } from 'xregexp'
import { defineDirective } from '../directive'

export default defineDirective<undefined>(() => ({
  nested: false,
  name: '#error',
  pattern: /.*?#(?<directive>(?:warning)|(?:error)|(?:info))\s*(?<message>[\u4E00-\u9FA5 \t\w]*).*?$/gm,
  processor({ ctx, id }) {
    return (...args) => {
      const group = args[args.length - 1] as NamedGroupsArray
      const source = args[args.length - 2] as string
      const index = args[args.length - 3] as number
      const lineNumber = (source.substring(0, index).match(/\n/g) || []).length + 1
      const file = `${relative(ctx.cwd, id)}:${lineNumber}`
      if (group.directive === 'warning')
        group.directive = 'warn'
      // @ts-expect-error ignore
      ctx.logger[group.directive](`${file}: ${group.message}`, { timestamp: true })
      return ''
    }
  },
}))
