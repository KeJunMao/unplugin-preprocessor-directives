import { IfToken, SimpleNode } from ".";

export interface ProgramNode extends SimpleNode {
  type: 'Program'
  body: SimpleNode[]
}

export interface CodeStatement extends SimpleNode {
  type: 'CodeStatement'
  value: string
}


export interface IfStatement extends SimpleNode {
  type: 'IfStatement',
  test: string,
  consequent: SimpleNode[],
  alternate: SimpleNode[],
  kind: IfToken['type']
}
