import { useEffect, useMemo, useState } from 'react'
import { throttle } from 'lodash'
import { useLatestRef } from '@hi-ui/use-latest'
import { addDOMEvent } from '@hi-ui/dom-utils'

/**
 * TODO: What is useScroll
 */
export const useScroll = (target: HTMLElement | Window) => {
  const [scrollValue, setScrollValue] = useState({ left: 0, top: 0 })

  const handleScrollRef = useLatestRef(
    throttle(() => {
      setScrollValue({
        left: container.scrollLeft,
        top: container.scrollTop,
      })
    }, 100)
  )

  const container = useMemo(() => {
    return target === window ? document.documentElement : (target as HTMLElement)
  }, [target])

  useEffect(() => {
    const cancelEvt = addDOMEvent(target, 'scroll', handleScrollRef.current, false)

    return () => {
      cancelEvt.remove()
    }
  }, [handleScrollRef, target])

  return scrollValue
}

export interface UseScrollProps {}

export type UseScrollReturn = ReturnType<typeof useScroll>
