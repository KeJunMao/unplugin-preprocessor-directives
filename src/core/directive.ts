import type { Directive, SimpleNode, SimpleToken } from './types/index'

export function defineDirective<T extends SimpleToken, N extends SimpleNode>(directive: Directive<T, N>) {
  return directive
}
