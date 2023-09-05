import type { Directive, DirectiveContext } from '../../types'
import IfDirective from './if'
import DefineDirective from './define'

export function defineDirective(
  directive: Directive | ((ctx: DirectiveContext) => Directive),
) {
  return directive
}

export const builtinDirectives = [DefineDirective, IfDirective]
