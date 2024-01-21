import type { Comment } from './types'

export const comments: Comment[] = [
  // js
  {
    type: 'js',
    start: '// ',
    end: '',
    regex: /^\/\/\s?(.*)$/,
  },
  // css
  {
    type: 'css',
    start: '/* ',
    end: ' */',
    regex: /^\/\*\s?(.*)\*\/$/,
  },
  // html
  {
    type: 'html',
    start: '<!-- ',
    end: ' -->',
    regex: /^<!--\s?(.*)-->$/,
  },
]
