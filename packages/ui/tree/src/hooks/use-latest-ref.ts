import { useRef } from 'react'

export const useLatestRef = <T>(value: T) => {
  const prevRef = useRef<T>(value)
  prevRef.current = value
  return prevRef
}
