import type { FilterPattern } from 'vite'
import { Directive } from './core/types'

export interface Options {
  cwd: string
  directives: Directive[]
  include: FilterPattern
  exclude: FilterPattern
}

export interface UserOptions extends Partial<Options> { }
