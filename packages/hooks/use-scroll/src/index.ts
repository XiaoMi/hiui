import { useEffect, useMemo, useState } from 'react'
import { addDOMEvent } from '@hi-ui/dom-utils'
import { useLatestRef } from '@hi-ui/use-latest'
import { throttleByRaf } from '@hi-ui/throttle-by-raf'

/**
 * TODO: What is useScroll
 */
export const useScroll = (target: HTMLElement | Window | null) => {
  const [scrollValue, setScrollValue] = useState({ left: 0, top: 0 })

  const handleScrollRef = useLatestRef(
    throttleByRaf(() => {
      setScrollValue({
        left: container?.scrollLeft,
        top: container?.scrollTop,
      })
    })
  )

  const container = useMemo(() => {
    return target === window ? document.documentElement : (target as HTMLElement)
  }, [target])

  useEffect(() => {
    if (!target) return

    const cancelEvt = addDOMEvent(target, 'scroll', handleScrollRef.current, false)

    return () => {
      handleScrollRef.current.cancel()
      cancelEvt.remove()
    }
  }, [handleScrollRef, target])

  return scrollValue
}

export interface UseScrollProps {}

export type UseScrollReturn = ReturnType<typeof useScroll>
