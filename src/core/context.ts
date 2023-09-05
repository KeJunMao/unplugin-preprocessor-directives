import process from 'node:process'
import type { Logger } from 'vite'
import { createLogger, loadEnv } from 'vite'
import XRegExp from 'xregexp'
import type {
  Directive,
  MatchGroup,
  NormalDirective,
  RecursiveDirective,
  UserOptions,
} from '../types'

import { builtinDirectives } from './directive'

export interface replaceOptions {
  code: string
  id: string
  directive: Directive
}

export class Context {
  cwd: string
  XRegExp: typeof XRegExp
  env: Record<string, string>
  directives: Directive[] = []
  logger: Logger
  constructor({ cwd = process.cwd(), directives = [] }: UserOptions = {}) {
    this.cwd = cwd
    this.XRegExp = XRegExp
    this.env = loadEnv(
      process.env.NODE_ENV || 'development',
      process.cwd(),
      '',
    )

    this.directives = [...directives, ...builtinDirectives].map(v =>
      typeof v === 'function' ? v(this) : v,
    )

    this.logger = createLogger(undefined, {
      prefix: 'unplugin-preprocessor-directives',
    })
  }

  replace({ code, id, directive: _directive }: replaceOptions) {
    const directive = _directive as NormalDirective
    return this.XRegExp.replace(code, directive.pattern, directive.processor({
      id,
      code,
      directive,
      ctx: this,
    }))
  }

  replaceRecursive({
    code,
    id,
    directive: _directive,
  }: replaceOptions) {
    const directive = _directive as RecursiveDirective
    const startRegex = new RegExp(directive.pattern.start, 'mi')
    const endRegex = new RegExp(directive.pattern.end, 'mi')

    const replace = (code: string) => {
      const matches = XRegExp.matchRecursive(
        code,
        startRegex.source,
        endRegex.source,
        'gmi',
        {
          valueNames: ['between', 'left', 'match', 'right'],
        },
      )
      let builder = ''
      const matchGroup: MatchGroup = {
        left: null,
        match: '',
        right: null,
      }

      if (!matches.length)
        builder += code

      matches.forEach((match) => {
        switch (match.name) {
          case 'between':
            builder += match.value
            break
          case 'left':
            matchGroup.left = startRegex.exec(match.value)
            break
          case 'match':
            matchGroup.match = match.value
            break
          case 'right':
            matchGroup.right = endRegex.exec(match.value)
            builder += directive.processor({
              id,
              code,
              directive,
              ctx: this,

              replace,
              matchGroup,
            })
            break
        }
      })

      return builder
    }

    return replace(code)
  }

  transform(code: string, id: string) {
    const data = this.directives.reduce((acc, directive) => {
      acc = directive.nested
        ? this.replaceRecursive({
          code,
          id,
          directive: directive as RecursiveDirective,
        })
        : this.replace({
          code,
          id,
          directive: directive as NormalDirective,
        })
      return acc
    }, code)

    return data
  }
}
