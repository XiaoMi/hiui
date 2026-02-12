import { useState, useCallback } from 'react'
import { useMutableRef } from './ref'

/**
 * 使用 ref 存储状态，函数签名与 useState 基本一致
 * @desc refState 可手动通过 current 修改(可以但不建议经常这样做)
 * @desc setRefState 可通过第二个参数决定是否触发更新
 */
export function useRefState<T>(factory: () => T) {
  const refState = useMutableRef<T>(factory)
  const [, forceUpdate] = useState({})

  const setRefState = useCallback(
    function setRefState(state: T, shouldUpdate = true) {
      refState.current = state
      if (shouldUpdate) forceUpdate({})
    },
    [refState, forceUpdate]
  )

  return [refState, setRefState] as const
}
