import { useRef, useCallback } from 'react'

/**
 * Keep value up-to-date if it changes.
 *
 * @param value
 * @returns
 */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}

/**
 * Keep callback function up-to-date if it changes.
 *
 * @param callback
 * @returns
 */
export const useLatestCallback = <T extends (...args: any[]) => any>(
  callback: T | undefined
): T => {
  const ref = useLatestRef(callback)
  return useCallback((...args: any[]) => ref.current?.(...args), []) as T
}
