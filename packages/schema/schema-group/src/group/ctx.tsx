import React from 'react'
import type { ReadonlyRefObject } from '@hi-ui/use-ref-state'
import type { NormalizedProps } from './hooks/use-props'

export type SchemaGroupCtxType = {
  propsRef: ReadonlyRefObject<NormalizedProps>
}

export const SchemaGroupCtx = React.createContext<SchemaGroupCtxType>(
  null as unknown as SchemaGroupCtxType
)

export function useSchemaGroupCtx() {
  const ctx = React.useContext(SchemaGroupCtx)
  if (!ctx) throw new Error('useSchemaGroupCtx must be used within a SchemaGroup')
  return ctx
}
