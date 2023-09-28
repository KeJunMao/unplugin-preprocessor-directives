import IfDirective from './if'
import DefineDirective from './define'
import ErrorDirective from './error'

export { default as IfDirective } from './if'
export { default as DefineDirective } from './define'
export { default as ErrorDirective } from './error'

export const builtinDirectives = [DefineDirective(), IfDirective(), ErrorDirective()]
