import { useRef } from 'react'

/**
 * Keep value up-to-date if it changes.
 *
 * @param value
 * @returns
 */
export const useLatestRef = <T>(value: T) => {
  const prevRef = useRef<T>(value)
  prevRef.current = value
  return prevRef
}
