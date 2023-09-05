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

export interface RecursiveProcessorOptions {
  code: string
  id: string
  directive: RecursiveDirective
  ctx: Context

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
  pattern: string | RegExp
}

export type Directive = RecursiveDirective | NormalDirective
export type Plugin = Directive

export type DirectiveContext = Context

export interface Options {
  cwd: string
  directives: (Directive | ((ctx: DirectiveContext) => Directive))[]
}

export interface UserOptions extends Partial<Options> { }
