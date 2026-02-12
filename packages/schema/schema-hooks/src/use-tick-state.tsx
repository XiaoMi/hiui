import { useCallback } from 'react'
import { mergeValues } from '@hi-ui/schema-utils'
import { useSubscription, useSubscribe } from '@hi-ui/use-subscription'
import type { Subscription } from '@hi-ui/use-subscription'

export type TickStateType<T extends AnyObject = AnyObject> = T & {
  tick: number
} & AnyObject

export type SetTickStateType<T extends AnyObject = AnyObject> = (
  value?: Partial<Omit<TickStateType<T>, 'tick'>>
) => void

/**
 * 创建一个可订阅的 tick 状态
 * @desc 用来在 memo 良好的内部传递变更状态
 * @desc 内部通常可通过上下文 ref 获取到最新的值，但却需要重渲染时才能再次执行
 * @desc 此种情况，便可使用 tickState 来触发重渲染
 * @desc 一般只需要创建状态并在合适位置订阅即可，有特殊需要也可在 state 中携带所需信息
 */
export function useTickState<T extends AnyObject = AnyObject>() {
  const tickState = useSubscription<TickStateType<T>>(() => ({ tick: 0 } as TickStateType<T>))

  const setTickState: SetTickStateType<T> = useCallback(
    function setTickState(value?: Partial<Omit<TickStateType<T>, 'tick'>>) {
      const state = tickState.getValue()
      const nextTick = state.tick + 1

      if (!value) {
        tickState.setValue({ ...state, tick: nextTick })
        return
      }

      const nextState = mergeValues(
        state,
        value as TickStateType<T>,
        { tick: nextTick } as TickStateType<T>
      )

      tickState.setValue(nextState)
    },
    [tickState]
  )

  return [tickState, setTickState] as const
}

export function useSubscribeTickState<T extends AnyObject = AnyObject>(
  state: Subscription<TickStateType<T>>
) {
  const values = useSubscribe(state)
  return values
}
