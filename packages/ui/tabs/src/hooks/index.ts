import { useRef, useEffect } from 'react'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'

interface UseResizeObserverProps {
  element: HTMLElement | null
  onResize: (element: HTMLElement, size?: any) => void
  initialSize?: any
  getSize?: (element: HTMLElement) => any
}

export const useResizeObserver = ({
  element,
  onResize,
  initialSize = 0,
  getSize,
}: UseResizeObserverProps) => {
  const getSizeLatestRef = useLatestRef(getSize)
  const onResizeLatest = useLatestCallback(onResize)

  const prevSizeRef = useRef(initialSize)

  useEffect(() => {
    let resizeObserver: ResizeObserver

    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        const getSize = getSizeLatestRef.current
        if (element) {
          if (getSize) {
            const nextSize = getSize(element)
            if (prevSizeRef.current !== nextSize) {
              prevSizeRef.current = nextSize
              onResizeLatest(element, nextSize)
            }
          } else {
            onResizeLatest(element)
          }
        }
      })
      resizeObserver.observe(element)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [element, getSizeLatestRef, onResizeLatest])
}
