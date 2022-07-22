import { useCallback, useRef } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'

/**
 * TODO: What is useTimeout
 * 1. 负责props变化需要取消定时器以及页面卸载时取消定时器这一套逻辑
 * 2. 处理 window 支持 SSR
 */
export const useTimeout = (callback: (...args: any[]) => any, timeoutDelayMs: number) => {
  const timerRef = useRef<number | undefined>(undefined)
  const callbackLatest = useLatestCallback(callback)

  const clear = useCallback(() => {
    if (timerRef.current === undefined) return

    window.clearTimeout(timerRef.current)
    timerRef.current = undefined
  }, [])

  const start = useCallback(() => {
    if (typeof timeoutDelayMs !== 'number' || timeoutDelayMs < 0) return

    timerRef.current = window.setTimeout(callbackLatest, timeoutDelayMs)
  }, [callbackLatest, timeoutDelayMs])

  return { start, clear }
}
