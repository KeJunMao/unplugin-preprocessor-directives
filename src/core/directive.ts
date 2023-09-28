import type { DirectiveFactory } from '../types'

export function defineDirective<UserOptions>(
  factory: DirectiveFactory<UserOptions>,
) {
  return (userOptions?: UserOptions) => {
    return factory(userOptions!)
  }
}
