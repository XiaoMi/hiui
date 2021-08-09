import React, { useEffect, useRef } from 'react'

/**
 * Handles the event of clicking outside of the wrapped component.
 *
 * @param ref
 * @param callback
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: (e: Event) => void
) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const onMouseDown: any = (evt: MouseEvent) => {
      if (!ref.current?.contains(evt.target as HTMLElement)) {
        callbackRef.current(evt)
      }
    }

    document.addEventListener('mousedown', onMouseDown, true)
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
    }
  }, [ref])
}
