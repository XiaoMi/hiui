import React from 'react'
import type { FormProps } from '@hi-ui/form'
import type { SubscriptionType } from '@hi-ui/use-subscription'
import type { TickStateType, SetTickStateType, ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { EnhancedFormRefType } from './ref'
import type { NormalizedProps } from './hooks/use-props'
import type { FormControlRefType } from './ref-control'

export type SchemaFormCtxType<TData extends AnyObject = AnyObject> = {
  formValue: SubscriptionType<TData>
  tickState: SubscriptionType<TickStateType>
  setTickState: SetTickStateType
  formRef: EnhancedFormRefType<TData>
  controlRef: FormControlRefType
  propsRef: ReadonlyRefObject<NormalizedProps<TData>>
  formElRef: React.RefObject<HTMLFormElement>
  gridWrapperElRef: React.MutableRefObject<React.RefObject<HTMLElement>>
  handleValuesChangeRef: ReadonlyRefObject<FormProps<TData>['onValuesChange']>
}

export const SchemaFormCtx = React.createContext<SchemaFormCtxType<AnyObject>>(
  null as unknown as SchemaFormCtxType<AnyObject>
)

export function useSchemaFormCtx<TData extends AnyObject = AnyObject>() {
  const ctx = React.useContext(SchemaFormCtx as React.Context<SchemaFormCtxType<TData>>)
  if (!ctx) throw new Error('useSchemaFormCtx must be used within a SchemaForm')
  return ctx
}
