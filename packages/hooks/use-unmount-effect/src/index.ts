import { useEffect, useRef } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'

/**
 * A hook for running when component unmount, will return unmountRef sign
 */
export const useUnmountEffect = (cleanup?: () => void) => {
  const cleanupLatest = useLatestCallback(cleanup)
  const unmountRef = useRef(false)

  useEffect(
    () => {
      return () => {
        unmountRef.current = true
        cleanupLatest()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return unmountRef
}
