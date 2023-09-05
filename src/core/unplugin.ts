import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { UserOptions } from '../types'
import { Context } from './context'

export const unpluginFactory: UnpluginFactory<UserOptions | undefined> = (
  options,
) => {
  const ctx = new Context(options)
  return {
    name: 'unplugin-preprocessor-directives',
    enforce: 'pre',
    transform: (code, id) => ctx.transform(code, id),
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
