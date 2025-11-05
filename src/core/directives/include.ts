import type { IncludeStatement, IncludeToken } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { defineDirective } from '../directive'
import { simpleMatchToken } from '../utils'

export const includeDirective = defineDirective<IncludeToken, IncludeStatement>((context) => {
  // 用于跟踪已包含的文件,防止循环引用(每次转换时重置)
  const includedFilesStack: Set<string>[] = []

  return {
    lex(comment) {
      return simpleMatchToken(comment, /#(include)\s+["<](.+)[">]/)
    },
    parse(token) {
      if (token.type === 'include') {
        this.current++
        return {
          type: 'IncludeStatement',
          value: token.value,
        }
      }
    },
    transform(node) {
      if (node.type === 'IncludeStatement') {
        let filePath = node.value

        // 解析文件路径
        // 如果不是绝对路径,则相对于 cwd
        if (!isAbsolute(filePath)) {
          filePath = resolve(context.options.cwd, filePath)
        }

        // 检查文件是否存在
        if (!existsSync(filePath)) {
          context.logger.warn(`Include file not found: ${filePath}`)
          return node
        }

        // 获取当前的包含文件集合
        const currentIncludedFiles = includedFilesStack[includedFilesStack.length - 1] || new Set<string>()

        // 防止循环引用
        if (currentIncludedFiles.has(filePath)) {
          context.logger.warn(`Circular include detected: ${filePath}`)
          return node
        }

        try {
          // 创建新的包含文件集合并添加当前文件
          const newIncludedFiles = new Set(currentIncludedFiles)
          newIncludedFiles.add(filePath)
          includedFilesStack.push(newIncludedFiles)

          // 读取文件内容
          const fileContent = readFileSync(filePath, 'utf-8')

          // 递归处理被包含的文件
          const processedContent = context.transform(fileContent, filePath)

          // 弹出当前层级的包含文件集合
          includedFilesStack.pop()

          // 如果文件经过了预处理,返回处理后的代码
          if (processedContent) {
            return {
              type: 'CodeStatement',
              value: processedContent,
              start: node.start,
              end: node.end,
              comment: node.comment,
            }
          }

          // 如果没有预处理指令,直接返回原始内容
          return {
            type: 'CodeStatement',
            value: fileContent,
            start: node.start,
            end: node.end,
            comment: node.comment,
          }
        }
        catch (error) {
          // 确保出错时也弹出栈
          includedFilesStack.pop()
          context.logger.error(`Error including file ${filePath}: ${error}`)
        }
      }
    },
    generate(node, comment) {
      if (node.type === 'IncludeStatement' && comment) {
        return `${comment.start} #include "${node.value}" ${comment.end}`
      }
    },
  }
})
