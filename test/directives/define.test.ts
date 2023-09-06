import { resolve } from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { Context } from '../../src/core/context'

describe('css', () => {
  const root = resolve(__dirname, '../fixtures/css')
  const ctx = new Context({
    cwd: root,
  })
  function transform(fileName: string) {
    const filePath = resolve(root, fileName)
    const code = fs.readFileSync(filePath, { encoding: 'utf-8' })
    return ctx.transform(code, filePath)?.code
  }

  it('define', () => {
    transform('define.css')
    expect(ctx.env.CSS).to.true
  })

  it('undef', () => {
    transform('undef.css')
    expect(ctx.env.CSS).to.undefined
  })
})

describe('js', () => {
  const root = resolve(__dirname, '../fixtures/js')
  const ctx = new Context({
    cwd: root,
  })
  function transform(fileName: string) {
    const filePath = resolve(root, fileName)
    const code = fs.readFileSync(filePath, { encoding: 'utf-8' })
    return ctx.transform(code, filePath)?.code
  }

  it('define', () => {
    transform('define.js')
    expect(ctx.env.JS).to.true
  })

  it('undef', () => {
    transform('undef.js')
    expect(ctx.env.JS).to.undefined
  })
})

describe('html', () => {
  const root = resolve(__dirname, '../fixtures/html')
  const ctx = new Context({
    cwd: root,
  })
  function transform(fileName: string) {
    const filePath = resolve(root, fileName)
    const code = fs.readFileSync(filePath, { encoding: 'utf-8' })
    return ctx.transform(code, filePath)?.code
  }

  it('define', () => {
    transform('define.html')
    expect(ctx.env.HTML).to.true
  })

  it('undef', () => {
    transform('undef.html')
    expect(ctx.env.HTML).to.undefined
  })
})
