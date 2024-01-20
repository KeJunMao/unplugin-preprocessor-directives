import { createFilter } from 'vite'
import { UserOptions } from '../../types'
import { Lex, ObjectDirective, Parse, Transform } from '../types'
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
  filter: (id: string) => boolean
  env: Record<string, any> = process.env
  constructor(options?: UserOptions) {
    this.options = resolveOptions(options)
    this.directives = sortUserDirectives(this.options.directives.map(d => typeof d === 'function' ? d(this) : d)).flat()
    this.lexers = this.directives.map(d => d.lex)
    this.parsers = this.directives.map(d => d.parse)
    this.transforms = this.directives.map(d => d.transform)
    this.filter = createFilter(this.options.include, this.options.exclude)
  }

  transform(code: string, id: string) {
    const tokens = Lexer.lex(code, this.lexers)
    const ast = Parser.parse(tokens, this.parsers)

    const transformed = Transformer.transform(ast, this.transforms)
    if (transformed) {
      const generated = Generator.generate(transformed)
      return generated
    }
  }
}
