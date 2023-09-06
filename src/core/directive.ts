import type { Directive, DirectiveContext } from '../types'

export function defineDirective(
  directive: Directive | ((ctx: DirectiveContext) => Directive),
) {
  return directive
}
