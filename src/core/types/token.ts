import type { SimpleToken } from '.'

export interface CodeToken extends SimpleToken {
  type: 'code'
  value: string
}
export interface IfToken extends SimpleToken {
  type: 'if' | 'else' | 'elif' | 'endif'
  value: string
}
export interface DefineToken extends SimpleToken {
  type: 'define' | 'undef'
  value: string
}

export interface MessageToken extends SimpleToken {
  type: 'error' | 'warning' | 'info'
  value: string
}

export interface IncludeToken extends SimpleToken {
  type: 'include'
  value: string
}
