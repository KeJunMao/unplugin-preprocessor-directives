import { createFilter as _createFilter, FilterPattern } from '@rollup/pluginutils'

export const createFilter = _createFilter as (
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: { resolve?: string | false | null },
) => (id: string | unknown) => boolean