import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  shims: false,
  onSuccess: 'npm run build:fix',
  noExternal: [
    '@rollup/pluginutils'
  ]
})
