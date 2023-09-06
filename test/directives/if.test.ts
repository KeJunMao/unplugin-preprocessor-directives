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

  it('if', () => {
    expect(transform('if.css')).toMatchSnapshot()
  })

  it('else', () => {
    expect(transform('else.css')).toMatchSnapshot()
  })

  it('elif', () => {
    expect(transform('elif.css')).toMatchSnapshot()
  })

  it('nested', () => {
    expect(transform('nested.css')).toMatchSnapshot()
  })

  it('empty', () => {
    expect(transform('empty.css')).toBe(undefined)
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

  it('if', () => {
    expect(transform('if.js')).toMatchSnapshot()
  })

  it('else', () => {
    expect(transform('else.js')).toMatchSnapshot()
  })

  it('elif', () => {
    expect(transform('elif.js')).toMatchSnapshot()
  })

  it('nested', () => {
    expect(transform('nested.js')).toMatchSnapshot()
  })

  it('empty', () => {
    expect(transform('empty.js')).toBe(undefined)
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

  it('if', () => {
    expect(transform('if.html')).toMatchSnapshot()
  })

  it('else', () => {
    expect(transform('else.html')).toMatchSnapshot()
  })

  it('elif', () => {
    expect(transform('elif.html')).toMatchSnapshot()
  })

  it('nested', () => {
    expect(transform('nested.html')).toMatchSnapshot()
  })

  it('empty', () => {
    expect(transform('empty.html')).toBe(undefined)
  })
})
