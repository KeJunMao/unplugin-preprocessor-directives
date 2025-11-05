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

/**
 * Represents an object-based directive configuration for preprocessing.
 *
 * @template T - The type of token produced by the lexer, defaults to SimpleToken
 * @template N - The type of AST node produced by the parser, defaults to SimpleNode
 *
 * @property {('pre' | 'post')} [enforce] - Optional enforcement phase for when the directive should be applied
 * @property {Lex<T>} lex - Lexical analyzer function that tokenizes the input
 * @property {Parse<T, N>} parse - Parser function that converts tokens into AST nodes
 * @property {Transform<N>} transform - Transformation function that modifies AST nodes
 * @property {Generate} generate - Code generation function that produces the final output
 */
export interface ObjectDirective<T = SimpleToken, N = SimpleNode> {
  enforce?: 'pre' | 'post'
  lex: Lex<T>
  parse: Parse<T, N>
  transform: Transform<N>
  generate?: Generate
}

export interface FunctionDirective<T = SimpleToken, N = SimpleNode> {
  (context: Context): ObjectDirective<T, N>
}

export type Directive<T = SimpleToken, N = SimpleNode> = ObjectDirective<T, N> | FunctionDirective<T, N>
