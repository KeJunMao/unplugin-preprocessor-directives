import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { Context, ifDirective } from '../src'

describe('if', () => {
  const root = resolve(__dirname, './fixtures')
  const context = new Context({
    directives: [ifDirective],
  })

  fg.sync('if.*', { cwd: root }).forEach((file) => {
    it(`should parse ${file}, dev = true`, () => {
      context.env.DEV = true
      const code = readFileSync(resolve(root, file), 'utf-8')
      const result = context.transform(code, file)
      expect(result).toMatchSnapshot()
    })
  })

  fg.sync('if.*', { cwd: root }).forEach((file) => {
    it(`should parse ${file}, dev = false`, () => {
      context.env.DEV = false
      const code = readFileSync(resolve(root, file), 'utf-8')
      const result = context.transform(code, file)
      expect(result).toMatchSnapshot()
    })
  })
})
