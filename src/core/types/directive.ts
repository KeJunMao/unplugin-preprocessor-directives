import { Context } from "../context"
import { Lexer } from "../context/lexer"
import { Parser } from "../context/parser"

export interface SimpleToken {
  type: string
  value: string
  [x: string]: any
}

export interface SimpleNode {
  type: string
  [x: string]: any
}

export type Lex<T = SimpleToken> = (this: Lexer, currentLine: string) => (T | void)
export type Parse<T = SimpleToken, N = SimpleNode> = (this: Parser, currentToken: T) => (N | void)

export interface ObjectDirective<T = SimpleToken, N = SimpleNode> {
  enforce?: 'pre' | 'post'
  lex: Lex<T>
  parse: Parse<T, N>
}

export interface FunctionDirective<T = SimpleToken, N = SimpleNode> {
  (context: Context): ObjectDirective<T, N>
}

export type Directive<T = SimpleToken, N = SimpleNode> = ObjectDirective<T, N> | FunctionDirective<T, N>
