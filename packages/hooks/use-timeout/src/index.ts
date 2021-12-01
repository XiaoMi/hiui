import { useCallback, useRef } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'

/**
 * TODO: What is useTimeout
 */
export const useTimeout = (callback: (...args: any[]) => any, timeoutDelayMs: number) => {
  const timerRef = useRef<number>()
  const callbackLatest = useLatestCallback(callback)

  const clear = useCallback(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = undefined
  }, [])

  const start = useCallback(() => {
    timerRef.current = window.setTimeout(callbackLatest, timeoutDelayMs)
  }, [callbackLatest, timeoutDelayMs])

  return { start, clear }
}
