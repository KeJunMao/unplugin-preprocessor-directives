import type { Comment } from './types'

export const comments: Comment[] = [
  // js
  {
    type: 'js',
    start: '// ',
    end: '',
    regex: /^\/\/\s?(.*)$/,
  },
  // jsx
  {
    type: 'jsx',
    start: '{/* ',
    end: ' */}',
    regex: /^\{\s?\/\*\s?(.*)\s?\*\/\s?\}$/,
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
