import type { Context } from '../context'
import type { Generator } from '../context/generator'
import type { Lexer } from '../context/lexer'
import type { Parser } from '../context/parser'
import type { Transformer } from '../context/transformer'
import type { Comment } from '../types'

export interface SimpleToken {
  comment?: string
  type: string
  value: string
  start?: number
  end?: number
  [x: string]: any
}

export interface SimpleNode {
  comment?: string
  type: string
  start?: number
  end?: number
  [x: string]: any
}

export type Lex<T = SimpleToken> = (this: Lexer, currentLine: string) => (T | void)
export type Parse<T = SimpleToken, N = SimpleNode> = (this: Parser, currentToken: T) => (N | void)
export type Transform<N = SimpleNode, ResultN = SimpleNode> = (this: Transformer, currentNode: N) => (ResultN | void)
export type Generate = (this: Generator, ast: SimpleNode, comment?: Comment) => (string | void)

export interface ObjectDirective<T = SimpleToken, N = SimpleNode> {
  enforce?: 'pre' | 'post'
  lex: Lex<T>
  parse: Parse<T, N>
  transform: Transform<N>
  generate: Generate
}

export interface FunctionDirective<T = SimpleToken, N = SimpleNode> {
  (context: Context): ObjectDirective<T, N>
}

export type Directive<T = SimpleToken, N = SimpleNode> = ObjectDirective<T, N> | FunctionDirective<T, N>
