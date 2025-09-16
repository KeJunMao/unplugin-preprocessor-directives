import process from 'node:process'
import type { Logger } from 'vite'
import { createFilter, createLogger, loadEnv } from 'vite'
import MagicString from 'magic-string'
import type { UserOptions } from '../../types'
import type { Generate, Lex, ObjectDirective, Parse, Transform } from '../types'
import { Generator } from './generator'
import { Lexer } from './lexer'
import { Parser } from './parser'
import { Transformer } from './transformer'

export * from './lexer'
export * from './parser'

export function resolveOptions(options?: UserOptions): Required<UserOptions> {
  return {
    cwd: process.cwd(),
    include: ['**/*'],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    directives: [],
    ...options,
  }
}

export function sortUserDirectives(
  directives: ObjectDirective[],
): [ObjectDirective[], ObjectDirective[], ObjectDirective[]] {
  const preDirectives: ObjectDirective[] = []
  const postDirectives: ObjectDirective[] = []
  const normalDirectives: ObjectDirective[] = []

  if (directives) {
    directives.forEach((p) => {
      if (p.enforce === 'pre')
        preDirectives.push(p)
      else if (p.enforce === 'post')
        postDirectives.push(p)
      else normalDirectives.push(p)
    })
  }

  return [preDirectives, normalDirectives, postDirectives]
}

export class Context {
  options: Required<UserOptions>
  directives: ObjectDirective[]
  lexers: Lex[]
  parsers: Parse[]
  transforms: Transform[]
  generates: Generate[]
  filter: (id: string) => boolean
  env: Record<string, any> = process.env
  logger: Logger
  constructor(options?: UserOptions) {
    this.options = resolveOptions(options)
    this.directives = sortUserDirectives(this.options.directives.map(d => typeof d === 'function' ? d(this) : d)).flat()

    this.lexers = this.directives.map(d => d.lex)
    this.parsers = this.directives.map(d => d.parse)
    this.transforms = this.directives.map(d => d.transform)
    this.generates = this.directives.map(d => d.generate)

    this.filter = createFilter(this.options.include, this.options.exclude)
    this.logger = createLogger(undefined, {
      prefix: 'unplugin-preprocessor-directives',
    })
    this.env = this.loadEnv()
  }

  loadEnv(mode = process.env.NODE_ENV || 'development') {
    return loadEnv(
      mode,
      this.options.cwd,
      '',
    )
  }

  transform(code: string, _id: string) {
    const tokens = Lexer.lex(code, this.lexers)
    const hasDirective = tokens.some(token => token.type !== 'code')
    if (!hasDirective)
      return
    const ast = Parser.parse(tokens, this.parsers)

    const transformed = Transformer.transform(ast, this.transforms)
    if (transformed)
      return Generator.generate(transformed, this.generates)
  }

  transformWithMap(code: string, _id: string) {
    const generated = this.transform(code, _id)
    if (generated) {
      const ms = new MagicString(code, { filename: _id })
      ms.overwrite(0, code.length, generated)
      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      }
    }
  }
}
