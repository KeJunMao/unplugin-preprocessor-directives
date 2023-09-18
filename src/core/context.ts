import process from 'node:process'
import MagicString from 'magic-string'

import type { Logger } from 'vite'
import { createFilter, createLogger, loadEnv } from 'vite'
import XRegExp from 'xregexp'
import type {
  Directive,
  MatchGroup,
  NormalDirective,
  RecursiveDirective,
  UserOptions,
} from '../types'

import { builtinDirectives } from './directives'

export interface replaceOptions {
  code: string
  id: string
  directive: Directive
}
export function sortUserDirectives(
  directives: Directive[],
): [Directive[], Directive[], Directive[]] {
  const preDirectives: Directive[] = []
  const postDirectives: Directive[] = []
  const normalDirectives: Directive[] = []

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
  cwd: string
  XRegExp: typeof XRegExp
  env: Record<string, string>
  directives: Directive[] = []
  logger: Logger
  directiveLoggers: Record<string, Logger>
  filter: (id: unknown) => boolean
  constructor({ cwd = process.cwd(), directives = [], exclude = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/], include = ['**/*'] }: UserOptions = {}) {
    this.cwd = cwd
    this.XRegExp = XRegExp
    this.env = loadEnv(
      process.env.NODE_ENV || 'development',
      cwd,
      '',
    )

    const [preDirectives, normalDirectives, postDirectives] = sortUserDirectives(directives.map(v =>
      typeof v === 'function' ? v(this) : v,
    ))

    this.directives = [...builtinDirectives.map(v =>
      typeof v === 'function' ? v(this) : v,
    ), ...preDirectives, ...normalDirectives, ...postDirectives]

    this.logger = createLogger(undefined, {
      prefix: 'unplugin-preprocessor-directives',
    })
    this.directiveLoggers = this.directives.reduce((acc, directive) => {
      acc[directive.name] = createLogger(undefined, {
        prefix: `unplugin-preprocessor-directives:${directive.name}`,
      })
      return acc
    }, {} as Record<string, Logger>)

    this.filter = createFilter(include, exclude)
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

  createSource(code: string, id: string) {
    return new MagicString(code, {
      filename: id,
    })
  }

  transform(code: string, id: string) {
    if (!this.filter(id))
      return
    const source = this.createSource(code, id)
    const data = this.directives.reduce((acc, directive) => {
      const { exclude = [], include = ['**/*'] } = directive
      const filter = createFilter(include, exclude)
      if (!filter(id))
        return acc
      try {
        acc = directive.nested
          ? this.replaceRecursive({
            code,
            id,
            directive: directive as RecursiveDirective,
          })
          : this.replace({
            code: acc,
            id,
            directive: directive as NormalDirective,
          })
        return acc
      }
      catch (error: any) {
        this.directiveLoggers[directive.name].error(error)
        return acc
      }
    }, code)
    if (data !== code)
      source.overwrite(0, source.length(), data)

    if (source.hasChanged()) {
      return {
        code: source.toString(),
        map: source.generateMap({
          source: id,
          file: `${id}.map`,
          includeContent: true,
        }),
      }
    }
  }
}
