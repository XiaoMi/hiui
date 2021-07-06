import React, { useEffect, useCallback, useRef } from 'react'

/**
 * TODO: What is useClickOutside
 */
export const useClickOutside = (props: UseClickOutsideProps) => {
  const { onClickOutside, ref, eventName = 'click', attachEle } = props
  const element = useRef('')

  const handleOutside = useCallback(
    (e) => {
      const targetElement = typeof dom === 'function' ? dom() : dom
      const el = targetElement || element.current
      if (el) {
        if (attachEle) {
          !(attachEle.contains(e.target) || el.contains(e.target)) && onClickOutside(e)
        } else {
          !el.contains(e.target) && onClickOutside(e)
        }
      }
    },
    [onClickOutside, dom, element]
  )
  useEffect(() => {
    // 使用事件捕获
    document.addEventListener(eventName, handleOutside, true)
    return () => {
      document.removeEventListener(eventName, handleOutside, true)
    }
  }, [eventName, onClickOutside, element])
  return element
}

interface UseClickOutsideProps {
  ref: React.RefObject<HTMLElement>
  handler?: (e: Event) => void
  type?: 'down' | 'up'
}
