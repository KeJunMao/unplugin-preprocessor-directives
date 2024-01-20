import { SimpleToken } from ".";

export interface CodeToken extends SimpleToken {
  type: 'code'
  value: string
}
export interface IfToken extends SimpleToken {
  type: 'if' | 'else' | 'elif' | 'endif'
  value: string
}
