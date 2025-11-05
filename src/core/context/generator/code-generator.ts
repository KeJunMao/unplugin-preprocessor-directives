import type { Generate, SimpleNode } from '../../types'
import type { GeneratorOptions } from './generator'
import { Generator } from './generator'

export interface CodeGeneratorOptions extends GeneratorOptions { }

/**
 * 纯代码生成器
 * 从 AST 节点生成代码字符串，不依赖 MagicString
 */
export class CodeGenerator extends Generator {
  private generatedCode: string[] = []

  /**
   * 添加代码片段到生成结果
   */
  append(code: string): void {
    this.generatedCode.push(code)
  }

  /**
   * 处理 CodeStatement 节点
   */
  protected handleCodeStatement(node: SimpleNode): void {
    this.append(node.value)
  }

  /**
   * 处理自定义生成器返回的结果
   */
  protected handleGeneratorResult(node: SimpleNode, result: string): void {
    this.append(result)
  }

  /**
   * 保留节点（用于 unhandled: 'keep' 策略）
   */
  protected handleKeepNode(node: SimpleNode): void {
    if ('value' in node && typeof node.value === 'string')
      this.append(node.value)
  }

  /**
   * 生成最终代码
   */
  private generate(): string {
    this.generatedCode = []
    this.walk(this.node)
    return this.generatedCode.join('')
  }

  /**
   * 静态方法：从 AST 节点生成代码
   */
  static generate(
    node: SimpleNode,
    generates: (Generate | undefined)[] = [],
    options: CodeGeneratorOptions = {},
  ): string {
    return new CodeGenerator(node, generates, options).generate()
  }
}
