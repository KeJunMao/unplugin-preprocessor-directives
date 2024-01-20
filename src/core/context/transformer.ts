import { ProgramNode, SimpleNode, Transform } from "../types";

export class Transformer {
  constructor(public program: ProgramNode, public transforms: Transform[] = []) {
  }

  public walk(node: SimpleNode): SimpleNode | void {
    switch (node.type) {
      case 'Program':
        return {
          ...node,
          body: node.body.map(this.walk.bind(this)).filter((n: any) => !!n)
        } as ProgramNode;
      case 'CodeStatement':
        return node;
    }


    for (const transformer of this.transforms) {
      const transformed = transformer.bind(this)(node)
      if (transformed) return transformed
    }

    throw new Error(`Transformer: Unknown node type: ${node.type}`);
  }

  private transform(): SimpleNode | void {
    const ast = this.walk(this.program)

    return ast
  }

  static transform(program: ProgramNode, transforms: Transform[] = []) {
    const transformer = new Transformer(program, transforms)
    return transformer.transform()
  }
}
