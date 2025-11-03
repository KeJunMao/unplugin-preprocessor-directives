import type MagicString from 'magic-string'
import type { Generate, SimpleNode } from '../types'
import { findComment } from '../utils'

export class Generator {
  constructor(public node: SimpleNode, public generates: Generate[] = []) {
  }

  walk(node: SimpleNode): string | void {
    switch (node.type) {
      case 'Program':
        return node.body.map(this.walk.bind(this)).filter((n: any) => !!n).join('')
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

  // 收集所有应该保留的代码段
  private collectCodeRanges(node: SimpleNode, ranges: Array<{ start: number, end: number }> = []): Array<{ start: number, end: number }> {
    switch (node.type) {
      case 'Program':
        node.body.forEach((child: SimpleNode) => this.collectCodeRanges(child, ranges))
        return ranges
      case 'CodeStatement':
        if (node.start !== undefined && node.end !== undefined) {
          ranges.push({ start: node.start, end: node.end })
        }
        return ranges
    }

    // 对于其他类型的节点,尝试收集其内容
    // 这种情况不应该发生在转换后的 AST 中
    throw new Error(`Generator: Unexpected node type in transformed AST: ${node.type}`)
  }

  // 使用 MagicString 生成代码并支持 source map
  private generateWithMap(s: MagicString): void {
    // 收集所有应该保留的代码段
    const ranges = this.collectCodeRanges(this.node)

    if (ranges.length === 0) {
      // 如果没有要保留的代码,删除所有内容
      s.remove(0, s.original.length)
      return
    }

    // 按 start 位置排序
    ranges.sort((a, b) => a.start - b.start)

    // 删除不在保留范围内的内容
    let lastEnd = 0
    for (const range of ranges) {
      if (range.start > lastEnd) {
        // 删除 lastEnd 到 range.start 之间的内容
        s.remove(lastEnd, range.start)
      }
      lastEnd = range.end
    }

    // 删除最后一个范围之后的内容
    if (lastEnd < s.original.length) {
      s.remove(lastEnd, s.original.length)
    }
  }

  static generateWithMap(node: SimpleNode, generates: Generate[] = [], s: MagicString) {
    new Generator(node, generates).generateWithMap(s)
  }
}
