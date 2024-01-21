import type { IfToken, SimpleNode } from '.'

export interface ProgramNode extends SimpleNode {
  type: 'Program'
  body: SimpleNode[]
}

export interface CodeStatement extends SimpleNode {
  type: 'CodeStatement'
  value: string
}

export interface IfStatement extends SimpleNode {
  type: 'IfStatement'
  test: string
  consequent: SimpleNode[]
  alternate: SimpleNode[]
  kind: IfToken['type']
}

export interface DefineStatement extends SimpleNode {
  type: 'DefineStatement'
  kind: 'define' | 'undef'
  value: string
}

export interface MessageStatement extends SimpleNode {
  type: 'MessageStatement'
  kind: 'error' | 'warning' | 'info'
  value: string
}
