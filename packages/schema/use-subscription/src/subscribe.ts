import { useEffect } from 'react'
import { useLatest } from 'ahooks'
import { pick } from 'lodash-es'
import { useRefState } from '@hi-ui/use-ref-state'
import { NOOP_SUBSCRIPTION } from './noop'
import type { Subscription } from './class'

export type SubscribeResult<T extends AnyObject, Key extends keyof T = keyof T> = {
  /** 所有依赖字段的值 */
  allDepValues: Pick<T, Key>
  /** 发生变化的依赖字段 */
  changedDepKeys: Key[]
  /** 发生变化的依赖字段的值 */
  changedDepValues: Partial<Pick<T, Key>>
}

export function useSubscribe<T extends AnyObject, Key extends keyof T = keyof T>(
  subscription: Subscription<T>,
  deps?: Key[]
): SubscribeResult<T, Key> {
  const depsRef = useLatest(deps)
  const [valueRef, setValueRef] = useRefState<SubscribeResult<T, Key>>(() => {
    const allValues = subscription.getValue()
    return {
      allDepValues: deps ? pick(allValues, deps) : allValues,
      changedDepKeys: [],
      changedDepValues: {},
    }
  })

  useEffect(() => {
    // 空订阅时，不执行任何操作
    if (subscription === NOOP_SUBSCRIPTION) {
      return () => {
        // 空订阅的占位空函数
      }
    }

    return subscription.subscribe((notification) => {
      const { value: newValue, changedValues } = notification

      const dftPayload: SubscribeResult<T, Key> = {
        allDepValues: newValue,
        changedDepKeys: [],
        changedDepValues: {},
      }

      // 不论如何
      // 只要收到订阅更新，就更新 valueRef
      // 但不主动触发重渲染
      valueRef.current = dftPayload

      // 静默更新时，不再执行
      if (notification.extra?.silent) return

      if (!depsRef.current) {
        setValueRef(dftPayload)
        return
      }

      // 过滤出变化依赖属性
      const changedDepKeys = depsRef.current.filter((key) => key in changedValues)

      if (changedDepKeys.length > 0) {
        setValueRef({
          allDepValues: pick(newValue, depsRef.current),
          changedDepKeys,
          changedDepValues: pick(changedValues, changedDepKeys) as Partial<Pick<T, Key>>,
        })
      }
    })
  }, [subscription, depsRef, valueRef, setValueRef])

  return valueRef.current
}
