import type { ReplacementValue } from 'xregexp'
import type { FilterPattern } from 'vite'
import type { Context } from './core/context'

export interface MatchGroup {
  left: RegExpExecArray | null
  match: string
  right: RegExpExecArray | null
}

interface BaseDirective {
  name: string
  enforce?: 'pre' | 'post'
  nested?: boolean
  include?: FilterPattern
  exclude?: FilterPattern
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

export interface RecursiveDirective extends BaseDirective {
  nested: true
  pattern: {
    start: string | RegExp
    end: string | RegExp
  }
  processor(options: RecursiveProcessorOptions): string
}

export interface NormalDirective extends BaseDirective {
  nested?: false
  pattern: string | RegExp
  processor(options: NormalProcessorOptions): ReplacementValue
}

export type Directive = RecursiveDirective | NormalDirective
export type FunctionDirective = ((ctx: DirectiveContext) => Directive)
export type Plugin = Directive

export type DirectiveContext = Context

export interface Options {
  cwd: string
  directives: Directive[] | FunctionDirective[]
  include: FilterPattern
  exclude: FilterPattern
}

export interface UserOptions extends Partial<Options> { }

export type DirectiveFactory<UserOptions> = (options: UserOptions) => FunctionDirective | Directive
