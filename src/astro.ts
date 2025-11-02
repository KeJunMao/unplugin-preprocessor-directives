import type { Options } from './types'

import unplugin from './core/unplugin'

export default (options: Options): any => ({
  name: 'unplugin-starter',
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
})
