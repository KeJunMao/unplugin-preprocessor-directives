import { UserOptions } from '../../types'
import { Lex, ObjectDirective, Parse } from '../types'
import { Lexer } from './lexer'
import { Parser } from './parser'
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
  constructor(options?: UserOptions) {
    this.options = resolveOptions(options)
    this.directives = sortUserDirectives(this.options.directives.map(d => typeof d === 'function' ? d(this) : d)).flat()
    this.lexers = this.directives.map(d => d.lex)
    this.parsers = this.directives.map(d => d.parse)
  }

  transform(code: string, id: string) {
    const tokens = Lexer.lex(code, this.lexers)
    const ast = Parser.parse(tokens, this.parsers)
    console.log(ast);

  }
}
