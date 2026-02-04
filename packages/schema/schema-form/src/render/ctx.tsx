import React, { useMemo } from 'react'
import { useLatest } from 'ahooks'
import type { TransformedFormFields } from '../item/mapper'

export type GroupedSimpleFields = {
  type: 'fields'
  fields: TransformedFormFields
}
export type GroupedChildFields = {
  type: 'child-groups'
  groups: GroupedSimpleFields[]
}
export type GroupedNestFields = {
  type: 'groups'
  groups: (GroupedSimpleFields | GroupedChildFields)[]
}

export type GroupedFieldsType = GroupedSimpleFields | GroupedNestFields | GroupedChildFields

export type SchemaFormRenderCtxType = {
  groupedFieldsRef: React.MutableRefObject<GroupedFieldsType[]>
}

export const SchemaFormRenderCtx = React.createContext<SchemaFormRenderCtxType>(
  null as unknown as SchemaFormRenderCtxType
)

export function useRenderCtx() {
  const ctx = React.useContext(SchemaFormRenderCtx as React.Context<SchemaFormRenderCtxType>)
  if (!ctx) throw new Error('useSchemaFormRenderCtx must be used within a SchemaForm')
  return ctx
}

type SchemaFormRenderCtxProviderProps = {
  groupedFields: GroupedFieldsType[]
}

export function SchemaFormRenderCtxProvider(
  props: React.PropsWithChildren<SchemaFormRenderCtxProviderProps>
) {
  const groupedFieldsRef = useLatest(props.groupedFields) as React.MutableRefObject<
    GroupedFieldsType[]
  >

  const ctxPayload = useMemo(() => ({ groupedFieldsRef }), [groupedFieldsRef])
  return (
    <SchemaFormRenderCtx.Provider value={ctxPayload}>{props.children}</SchemaFormRenderCtx.Provider>
  )
}
