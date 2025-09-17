import type { UnpluginFactory } from 'unplugin'
import type { UserOptions } from '../types'
import remapping from '@jridgewell/remapping'
import { createUnplugin } from 'unplugin'
import { Context } from './context'
import { ifDirective, MessageDirective, theDefineDirective } from './directives'

export const unpluginFactory: UnpluginFactory<UserOptions | undefined> = (
  options,
) => {
  // @ts-expect-error ignore
  const ctx = new Context({ ...options, directives: [ifDirective, theDefineDirective, MessageDirective, ...options?.directives ?? []] })
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
          ...config.env,
        }
      },
      transform(code, id) {
        if (ctx.filter(id)) {
          const transformed = ctx.transformWithMap(code, id)
          if (transformed) {
            const map = remapping(
              [this.getCombinedSourcemap() as any, transformed.map],
              () => null,
            ) as any
            return {
              code: transformed.code,
              map,
            }
          }
        }
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
