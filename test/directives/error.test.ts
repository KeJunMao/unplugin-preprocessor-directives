import { resolve } from 'node:path'
import fs from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '../../src/core/context'

describe('css', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  const root = resolve(__dirname, '../fixtures/css')
  const ctx = new Context({
    cwd: root,
  })
  function transform(fileName: string) {
    const filePath = resolve(root, fileName)
    const code = fs.readFileSync(filePath, { encoding: 'utf-8' })
    return ctx.transform(code, filePath)?.code
  }
  it('error', () => {
    const spy = vi.spyOn(console, 'error')
    transform('error.css')
    expect(spy).toHaveBeenCalled()
  })
  it('warning', () => {
    const spy = vi.spyOn(console, 'warn')
    transform('warning.css')
    expect(spy).toHaveBeenCalled()
  })
  it('info', () => {
    const spy = vi.spyOn(console, 'log')
    transform('info.css')
    expect(spy).toHaveBeenCalled()
  })
})
