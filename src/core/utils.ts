import { SimpleToken, SimpleNode, ProgramNode } from "./types"

export function simpleMatchToken<T = SimpleToken>(comment: string, regex: RegExp) {
  const match = comment.match(regex)
  if (match) {
    return {
      type: match[1],
      value: match[2]?.trim(),
    } as T
  }
}

export const createProgramNode = (body: SimpleNode[] = []) => ({
  type: 'Program',
  body,
} as ProgramNode)
