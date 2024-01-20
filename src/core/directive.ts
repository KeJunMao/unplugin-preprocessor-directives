import { SimpleNode, SimpleToken, Directive } from "./types/index";

export function defineDirective<T extends SimpleToken, N extends SimpleNode>(directive: Directive<T, N>) {
  return directive
}
