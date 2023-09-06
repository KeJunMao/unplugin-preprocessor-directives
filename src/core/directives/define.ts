import type { NamedGroupsArray } from 'xregexp'
import { defineDirective } from '../directive'

export default defineDirective({
  nested: false,
  name: '#define',
  pattern: /.*?#(?<directive>(?:un)?def(?:ine)?)\s*(?<key>[\w]*)\s/gm,
  processor({ ctx }) {
    return (...args) => {
      const group = args[args.length - 1] as NamedGroupsArray
      if (group.directive === 'define')
        // @ts-expect-error ignore
        ctx.env[group.key] = true

      else if (group.directive === 'undef')
        delete ctx.env[group.key]

      return ''
    }
  },
})
