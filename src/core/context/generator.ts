import type { Node, ProgramNode } from './types'

export function generate(ast: ProgramNode) {
  function generate(node: Node): string {
    switch (node.type) {
      case 'Program':
        return node.body.map(generate).join('\n')
      case 'CodeStatement':
        return node.value
      case 'IfStatement':
        let code = ''
        if (node.kind === 'else')
          code = '// #v-else'

        else
          code = `// #v-${node.kind} ${node.test}`

        const consequentCode = node.consequent.map(generate).join('\n')
        code += `\n${consequentCode}`
        if (node.alternate.length) {
          const alternateCode = node.alternate.map(generate).join('\n')
          code += `\n${alternateCode}`
        }
        else {
          code += '\n// #v-endif'
        }
        return code
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  return generate(ast)
}
