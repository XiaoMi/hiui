import { useReadonlyRef } from '@hi-ui/use-ref-state'
import { Subscription, type SubscriptionExtraOpts as ExtraOpts } from './class'

// 传递工厂函数时，工厂函数仅会执行一次
export function useSubscription<T>(initialValue: T | (() => T), opts?: ExtraOpts) {
  return useReadonlyRef(() => {
    if (typeof initialValue === 'function') {
      const fn = initialValue as () => T // 不强转会报错
      return new Subscription(fn(), opts)
    }

    return new Subscription(initialValue, opts)
  }).current
}
