import React, { useEffect } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'

/**
 * Handles the event of clicking outside of the wrapped component.
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback?: (e: Event) => void,
  capture = true
) => {
  const callbackRef = useLatestRef(callback)

  useEffect(() => {
    const onMouseDown = (evt: MouseEvent) => {
      if (!callbackRef.current) return

      if (!ref.current) return

      if (ref.current.contains(evt.target as HTMLElement)) return

      callbackRef.current(evt)
    }

    const doc = getOwnerDocument(ref.current)

    doc.addEventListener('mousedown', onMouseDown, capture)
    return () => {
      doc.removeEventListener('mousedown', onMouseDown, capture)
    }
  }, [capture])
}

/**
 * Handles the event of clicking outside of the wrapped components.
 */
export const useRefsOutsideClick = (
  refs: React.RefObject<HTMLElement>[],
  callback?: (e: Event) => void,
  capture = true
) => {
  const callbackRef = useLatestRef(callback)

  useEffect(() => {
    const onMouseDown = (evt: MouseEvent) => {
      if (!callbackRef.current) return

      let isEmptyRefs = true
      let containedInRefs = false

      for (const ref of refs) {
        if (ref.current) {
          isEmptyRefs = false

          if (ref.current.contains(evt.target as HTMLElement)) {
            containedInRefs = true
            break
          }
        }
      }

      if (isEmptyRefs || containedInRefs) return

      callbackRef.current(evt)
    }

    // 注意，要求 refs 每项都在同一文档流下面
    const doc = getOwnerDocument(refs.find((ref) => Boolean(ref && ref.current))?.current)

    doc.addEventListener('mousedown', onMouseDown, capture)
    return () => {
      doc.removeEventListener('mousedown', onMouseDown, capture)
    }
  }, [...refs, capture])
}

function getOwnerDocument(el?: HTMLElement | null) {
  return (el instanceof Element && el.ownerDocument) || document
}
