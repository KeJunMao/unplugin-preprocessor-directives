import type { Generate, SimpleNode } from '../../types'
import { findComment } from '../../utils'

type UnhandledPolicy = 'throw' | 'keep' | 'remove'

export interface GeneratorOptions {
  unhandled?: UnhandledPolicy
}

/**
 * 生成器基类
 * 提供通用的 AST 遍历和节点处理逻辑
 */
export abstract class Generator {
  constructor(
    public readonly node: SimpleNode,
    public readonly generates: (Generate | undefined)[] = [],
    protected readonly options: GeneratorOptions = {},
  ) { }

  /**
   * 遍历 AST 节点
   */
  walk(node: SimpleNode): void {
    switch (node.type) {
      case 'Program':
        for (const child of node.body)
          this.walk(child)
        break
      case 'CodeStatement':
        this.handleCodeStatement(node)
        break
      default:
        this.processWithCustomGenerators(node)
    }
  }

  /**
   * 处理 CodeStatement 节点
   * 子类需要实现此方法
   */
  protected abstract handleCodeStatement(node: SimpleNode): void

  /**
   * 处理自定义生成器的结果
   * 子类需要实现此方法
   */
  protected abstract handleGeneratorResult(node: SimpleNode, result: string): void

  /**
   * 使用自定义生成器处理节点
   * 生成器返回值约定：
   * - string: 处理该节点
   * - null: 已手动处理
   * - undefined: 不处理，交给下一个生成器
   */
  private processWithCustomGenerators(node: SimpleNode): void {
    const comment = node.comment && findComment(node.comment)

    for (const generate of this.generates) {
      if (!generate)
        continue

      const result = generate.call(this as any, node, comment as any)

      if (result !== undefined) {
        if (result !== null)
          this.handleGeneratorResult(node, String(result))
        return
      }
    }

    this.handleUnprocessedNode(node)
  }

  /**
   * 处理未被任何生成器处理的节点
   */
  protected handleUnprocessedNode(node: SimpleNode): void {
    const policy = this.options.unhandled ?? 'throw'

    if (policy === 'remove') {
      // 默认删除行为
      return
    }

    if (policy === 'keep') {
      // 保留节点
      this.handleKeepNode(node)
      return
    }

    throw new Error(
      `Generator: Unhandled node type "${node.type}"${node.start != null && node.end != null
        ? ` at position ${node.start}-${node.end}`
        : ''
      }`,
    )
  }

  /**
   * 保留节点（用于 unhandled: 'keep' 策略）
   * 子类需要实现此方法
   */
  protected abstract handleKeepNode(node: SimpleNode): void
}
