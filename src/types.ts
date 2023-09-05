import type { ReplacementValue } from 'xregexp'
import type { FilterPattern } from 'vite'
import type { Context } from './core/context'

export interface MatchGroup {
  left: RegExpExecArray | null
  match: string
  right: RegExpExecArray | null
}

interface _Directive {
  name: string
  // TODO
  enforce?: 'pre' | 'post'
  nested?: boolean
}

export interface _ProcessorOptions {
  code: string
  id: string
  directive: Directive
  ctx: Context
}

export interface NormalProcessorOptions extends _ProcessorOptions {
  directive: NormalDirective
}

export interface RecursiveProcessorOptions extends _ProcessorOptions {
  directive: RecursiveDirective
  matchGroup: MatchGroup
  replace: (code: string) => string
}

export interface RecursiveDirective extends _Directive {
  nested: true
  pattern: {
    start: string | RegExp
    end: string | RegExp
  }
  processor(options: RecursiveProcessorOptions): string
}

export interface NormalDirective extends _Directive {
  nested?: false
  pattern: string | RegExp
  processor(options: NormalProcessorOptions): ReplacementValue
}

export type Directive = RecursiveDirective | NormalDirective
export type Plugin = Directive

export type DirectiveContext = Context

export interface Options {
  cwd: string
  directives: (Directive | ((ctx: DirectiveContext) => Directive))[]
  include: FilterPattern
  exclude: FilterPattern
}

export interface UserOptions extends Partial<Options> { }
