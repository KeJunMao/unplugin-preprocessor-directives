import type { ProgramNode, SimpleNode, SimpleToken } from './types'
import { comments } from './constant'

export function simpleMatchToken<T = SimpleToken>(comment: string, regex: RegExp) {
  const match = comment.match(regex)
  if (match) {
    return {
      type: match[1],
      value: match[2]?.trim(),
    } as T
  }
}

export function createProgramNode(body: SimpleNode[] = []) {
  return {
    type: 'Program',
    body,
  } as ProgramNode
}

export function isComment(line: string) {
  return comments.some(comment => comment.regex.test(line))
}

export function parseComment(line: string) {
  const comment = comments.find(comment => comment.start === line.slice(0, comment.start.length))
  const content = comment?.regex.exec(line)?.[1]

  return {
    type: comment?.type,
    content: content?.trim() ?? '',
  }
}

export function findComment(type: string) {
  return comments.find(comment => comment.type === type)!
}
