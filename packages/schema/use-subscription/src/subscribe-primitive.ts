import { useEffect, useState } from 'react'
import type { Subscription } from './class'

export function useSubscribePrimitive<T extends Primitive | undefined>(
  subscription: Subscription<T>
): [T] {
  const [state, setState] = useState<T>(subscription.getValue())

  useEffect(() => {
    return subscription.subscribe((notification) => {
      setState(notification.value)
    })
  }, [subscription])

  return [state]
}
