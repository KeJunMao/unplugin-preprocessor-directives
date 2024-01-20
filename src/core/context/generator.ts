import { Generate, SimpleNode } from "../types";

export class Generator {
  constructor(public node: SimpleNode, public generates: Generate[] = []) {
  }

  walk(node: SimpleNode): string | void {
    switch (node.type) {
      case 'Program':
        return node.body.map(this.walk.bind(this)).filter((n: any) => !!n).join('\n')
      case 'CodeStatement':
        return node.value
    }

    for (const generate of this.generates) {
      const generated = generate.call(this, node)
      if (generated) return generated
    }

    throw new Error(`Unknown node type: ${node.type}`);
  }

  private generate(): string {
    return this.walk(this.node) as string
  }

  static generate(node: SimpleNode, generates: Generate[] = []) {
    return new Generator(node, generates).generate()
  }
}
