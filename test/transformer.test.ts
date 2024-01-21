import { describe, expect, it } from 'vitest'
import { Transformer } from '../src/core/context/transformer';
import { ProgramNode, createProgramNode } from '../src';

describe('Transformer', () => {
  it('should transform the program correctly', () => {
    const program = createProgramNode([
      {
        type: 'CodeStatement',
        code: 'console.log("Hello, world!");'
      }
    ])
    const transformedProgram = Transformer.transform(program);

    // Assert the transformed program
    expect(transformedProgram).toEqual({
      type: 'Program',
      body: [
        {
          type: 'CodeStatement',
          code: 'console.log("Hello, world!");'
        }
      ]
    });
  });

  it('should throw an error for unknown node type', () => {
    const program = {
      type: 'UnknownNodeType',
      body: []
    } as unknown as ProgramNode
    expect(() => {
      Transformer.transform(program);
    }).toThrowError('Transformer: Unknown node type: UnknownNodeType');
  });
});
