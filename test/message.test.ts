import { describe, expect, it, vi } from 'vitest'
import { Context, ifDirective, MessageDirective } from '../src'

describe('message', () => {
  it('should log error message', () => {
    const context = new Context({
      directives: [MessageDirective],
    })

    const loggerErrorSpy = vi.spyOn(context.logger, 'error')
    const code = '// #error This is an error message'

    context.transform(code, 'test.js')

    expect(loggerErrorSpy).toHaveBeenCalledWith('This is an error message', { timestamp: true })
  })

  it('should log warning message', () => {
    const context = new Context({
      directives: [MessageDirective],
    })

    const loggerWarnSpy = vi.spyOn(context.logger, 'warn')
    const code = '// #warning This is a warning message'

    context.transform(code, 'test.js')

    expect(loggerWarnSpy).toHaveBeenCalledWith('This is a warning message', { timestamp: true })
  })

  it('should log info message', () => {
    const context = new Context({
      directives: [MessageDirective],
    })

    const loggerInfoSpy = vi.spyOn(context.logger, 'info')
    const code = '// #info This is an info message'

    context.transform(code, 'test.js')

    expect(loggerInfoSpy).toHaveBeenCalledWith('This is an info message', { timestamp: true })
  })

  it('with if directive', () => {
    const context = new Context({
      directives: [ifDirective, MessageDirective],
    })
    context.env.DEV = true

    const loggerInfoSpy = vi.spyOn(context.logger, 'info')
    const code = `
        // #if DEV
        // #info DEV mode is on
        // #endif

        // #if !DEV
        // #info DEV mode is off
        // #endif
        `

    context.transform(code, 'test.js')
    expect(loggerInfoSpy).toHaveBeenCalledWith('DEV mode is on', { timestamp: true })
  })
})
