import type MagicString from 'magic-string'
import type { Generate, SimpleNode } from '../../types'
import type { GeneratorOptions } from './generator'
import { Generator } from './generator'

type Range = readonly [number, number]

export interface MsGeneratorOptions extends GeneratorOptions { }

/**
 * 基于 MagicString 的代码转换器
 * 用于在现有源码基础上进行修改和删除操作
 */
export class MsGenerator extends Generator {
  private keepRanges: Range[] = []

  constructor(
    node: SimpleNode,
    generates: (Generate | undefined)[] = [],
    public readonly s: MagicString,
    options: GeneratorOptions = {},
  ) {
    super(node, generates, options)
  }

  keep(node: SimpleNode): void {
    if (this.hasValidRange(node))
      this.addKeepRange(node.start!, node.end!)
  }

  replace(node: SimpleNode, code: string): void {
    this.validateNodeRange(node, 'replace')
    this.s.overwrite(node.start!, node.end!, code)
    this.keep(node)
  }

  /**
   * 处理 CodeStatement 节点
   */
  protected handleCodeStatement(node: SimpleNode): void {
    // 如果有 value 属性且不同于原始代码，说明是转换后的代码，需要替换
    if (node.value && this.hasValidRange(node)) {
      const originalCode = this.s.original.slice(node.start!, node.end!)
      if (originalCode !== node.value) {
        this.replace(node, node.value)
        return
      }
    }
    // 否则保留原始代码
    this.keep(node)
  }

  /**
   * 处理自定义生成器返回的结果
   */
  protected handleGeneratorResult(node: SimpleNode, result: string): void {
    this.replace(node, result)
  }

  /**
   * 保留节点（用于 unhandled: 'keep' 策略）
   */
  protected handleKeepNode(node: SimpleNode): void {
    this.keep(node)
  }

  private addKeepRange(start: number, end: number): void {
    this.keepRanges.push([start, end])
  }

  private mergeKeepRanges(): Range[] {
    if (this.keepRanges.length === 0)
      return []

    // 按起始位置排序
    const sorted = [...this.keepRanges].sort((a, b) => a[0] - b[0])
    const merged: Range[] = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
      const [currentStart, currentEnd] = sorted[i]
      const lastMerged = merged[merged.length - 1]
      const [lastStart, lastEnd] = lastMerged

      if (currentStart <= lastEnd) {
        // 重叠或相邻，合并区间
        merged[merged.length - 1] = [lastStart, Math.max(lastEnd, currentEnd)]
      }
      else {
        // 不相邻，添加新区间
        merged.push([currentStart, currentEnd])
      }
    }

    return merged
  }

  private applyExclusion(): void {
    if (this.keepRanges.length === 0) {
      this.s.remove(0, this.s.original.length)
      return
    }

    const mergedRanges = this.mergeKeepRanges()
    this.removeUnkeptRanges(mergedRanges)
  }

  private removeUnkeptRanges(mergedRanges: Range[]): void {
    let lastEnd = 0

    for (const [start, end] of mergedRanges) {
      if (start > lastEnd)
        this.s.remove(lastEnd, start)
      lastEnd = end
    }

    // 删除最后一个保留范围之后的内容
    if (lastEnd < this.s.original.length)
      this.s.remove(lastEnd, this.s.original.length)
  }

  private hasValidRange(node: SimpleNode): boolean {
    return (node.start ?? node.end ?? false) !== false
  }

  private validateNodeRange(node: SimpleNode, operation: string): void {
    if (!this.hasValidRange(node)) {
      throw new Error(
        `Generator.${operation}: node is missing start/end position. Node type: ${node.type}`,
      )
    }
  }

  private generate(): void {
    this.keepRanges = []
    this.walk(this.node)
    this.applyExclusion()
  }

  /**
   * 静态方法：基于 MagicString 转换代码
   *
   * @param node - AST 节点
   * @param generates - 生成器函数数组
   * @param s - MagicString 实例
   * @param options - 选项
   */
  static generate(
    node: SimpleNode,
    generates: (Generate | undefined)[] = [],
    s: MagicString,
    options: GeneratorOptions = {},
  ): void {
    new MsGenerator(node, generates, s, options).generate()
  }
}
