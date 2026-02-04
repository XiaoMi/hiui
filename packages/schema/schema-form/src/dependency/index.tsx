import React from 'react'
import { useSubscribe } from '@hi-ui/use-subscription'
import { useDependencyCtx } from './ctx'

export type DependencyRenderCtx<T extends AnyObject = AnyObject> = AnyObject & {
  allValues: T & AnyObject
  // 目前内部已经做了判断，仅会在依赖字段发生变化时，才会触发
  // 因此 changedDepKeys 中必然包含当前字段依赖的字段(之一)
  // 当前字段依赖多个字段时，可能能够辅助判断
  changedDepKeys: (keyof T)[]
}

export type DependencyProps<T extends AnyObject, Key extends keyof T> = {
  deps?: Key[]
  ctx?: AnyObject
  children: (depValues: Pick<T, Key>, ctx: DependencyRenderCtx<Pick<T, Key> & T>) => React.ReactNode
}

export function Dependency<T extends AnyObject, Key extends keyof T>(
  props: DependencyProps<T, Key>
): React.ReactNode {
  const { subscription } = useDependencyCtx<T>()
  const { allDepValues: depValues, changedDepKeys } = useSubscribe(subscription, props.deps)

  return props.children(depValues, {
    ...props.ctx,
    changedDepKeys,
    allValues: subscription.getValue(),
  })
}
