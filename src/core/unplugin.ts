import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { UserOptions } from '../types'
import { Context } from './context'
import { ifDirective } from './directives'
import { defineAndUndefDirective } from './directives'

export const unpluginFactory: UnpluginFactory<UserOptions | undefined> = (
  options,
) => {
  // @ts-expect-error ignore
  const ctx = new Context({ ...options, directives: [ifDirective, defineAndUndefDirective, ...options?.directives ?? []] })
  return {
    name: 'unplugin-preprocessor-directives',
    enforce: 'pre',
    transform: (code, id) => ctx.transform(code, id),
    transformInclude(id) {
      return ctx.filter(id)
    },
    vite: {
      configResolved(config) {
        ctx.env = {
          ...ctx.loadEnv(config.mode),
          ...config.env
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
