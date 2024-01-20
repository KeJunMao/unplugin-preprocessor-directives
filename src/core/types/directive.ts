import { Context } from "../context"
import { Lexer } from "../context/lexer"
import { Parser } from "../context/parser"
import { Transformer } from "../context/transformer"
import { Generator } from "../context/generator"
import { ProgramNode } from "./node"

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
export type Transform<N = SimpleNode, ResultN = SimpleNode> = (this: Transformer, currentNode: N) => (ResultN | void)
export type Generate = (this: Generator, ast: SimpleNode) => (string | void)

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