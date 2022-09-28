import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from '@hi-ui/func-utils'
import type { DebounceReturn } from '@hi-ui/func-utils'

export const useLoading = ({ visible = true, delay = -1 }: UseLoadingProps) => {
  const [internalVisible, setInternalVisible] = useState(false)

  // Real trigger loading update
  const updateLoadingStatus = useCallback(() => {
    if (internalVisible === visible) return
    setInternalVisible(visible)
  }, [internalVisible, visible])

  const prevDebouncedUpdateRef = useRef<null | DebounceReturn>(null)

  const cancelWaitingLoading = () => {
    prevDebouncedUpdateRef.current?.cancel()
  }

  const shouldDelay = visible && delay >= 0

  const debouncedLoadingUpdater = useCallback(() => {
    cancelWaitingLoading()

    if (shouldDelay) {
      const debouncedUpdateLoading = debounce(updateLoadingStatus, delay)
      prevDebouncedUpdateRef.current = debouncedUpdateLoading

      debouncedUpdateLoading()
    } else {
      updateLoadingStatus()
      prevDebouncedUpdateRef.current = null
    }
  }, [delay, shouldDelay, updateLoadingStatus])

  useEffect(() => {
    debouncedLoadingUpdater()

    return () => {
      cancelWaitingLoading()
    }
  }, [debouncedLoadingUpdater])

  return {
    internalVisible,
    setInternalVisible,
  }
}

export interface UseLoadingProps {
  visible?: boolean
  delay?: number
}

export type useInputReturn = ReturnType<typeof useLoading>
