import type { Directive } from './core/types'

type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null

export interface Options {
  cwd: string
  directives: Directive[]
  include: FilterPattern
  exclude: FilterPattern
}

export interface UserOptions extends Partial<Options> { }
