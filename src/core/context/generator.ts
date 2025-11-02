import type { Generate, SimpleNode } from '../types'
import { findComment } from '../utils'

export class Generator {
  constructor(public node: SimpleNode, public generates: Generate[] = []) {
  }

  walk(node: SimpleNode): string | void {
    switch (node.type) {
      case 'Program':
        return node.body.map(this.walk.bind(this)).filter((n: any) => !!n && n !== '\r\n').join('')
      case 'CodeStatement':
        return node.value
    }

    for (const generate of this.generates) {
      const comment = findComment(node.comment!)
      const generated = generate.call(this, node, comment)
      if (generated)
        return generated
    }

    throw new Error(`Generator: Unknown node type: ${node.type}`)
  }

  private generate(): string {
    return this.walk(this.node) as string
  }

  static generate(node: SimpleNode, generates: Generate[] = []) {
    return new Generator(node, generates).generate()
  }
}
