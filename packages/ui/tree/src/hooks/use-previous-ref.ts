import { useRef, useEffect } from 'react'

export const usePreviousRef = <T>(value: T) => {
  const prevRef = useRef<T>(value)
  useEffect(() => {
    prevRef.current = value
  })
  return prevRef
}
