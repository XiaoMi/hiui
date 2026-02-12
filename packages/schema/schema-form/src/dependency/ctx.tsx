import React from 'react'
import type { SubscriptionType } from '@hi-ui/use-subscription'

export type DependencyCtxType<T extends AnyObject = AnyObject> = {
  subscription: SubscriptionType<T>
}

export const DependencyCtx = React.createContext<DependencyCtxType>(
  null as unknown as DependencyCtxType
)

export function useDependencyCtx<T extends AnyObject = AnyObject>() {
  const ctx = React.useContext(DependencyCtx as React.Context<DependencyCtxType<T>>)
  if (!ctx) throw new Error('useDependencyCtx must be used within a Dependency')
  return ctx
}
