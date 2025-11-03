import type { Logger } from 'vite'
import type { UserOptions } from '../../types'
import type { Generate, Lex, ObjectDirective, Parse, Transform } from '../types'
import process from 'node:process'
import MagicString from 'magic-string'
import { loadEnv } from '../utils/env'
import { createFilter } from '../utils/filter'
import { createLogger } from '../utils/logger'
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

  private _processCode(code: string) {
    const tokens = Lexer.lex(code, this.lexers)
    const hasDirective = tokens.some(token => token.type !== 'code')
    if (!hasDirective)
      return null
    const ast = Parser.parse(tokens, this.parsers)
    return Transformer.transform(ast, this.transforms)
  }

  transform(code: string, _id: string) {
    const transformed = this._processCode(code)
    if (transformed)
      return Generator.generate(transformed, this.generates)
  }

  transformWithMap(code: string, _id: string) {
    const transformed = this._processCode(code)
    if (transformed) {
      const s = new MagicString(code)
      Generator.generateWithMap(transformed, this.generates, s)
      return {
        code: s.toString(),
        map: s.generateMap({
          hires: true,
          source: _id,
        }),
      }
    }
  }
}
