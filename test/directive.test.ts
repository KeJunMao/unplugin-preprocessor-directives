import { describe, expect, it } from 'vitest'
import { defineDirective } from '../src'

describe('directive', () => {
  it('define', () => {
    const directive = defineDirective({
      name: '#test',
      nested: false,
      pattern: /#test/g,
      processor({ code }) {
        return code
      },
    })
    expect(directive).to.toBeDefined()
  })
})
