import React, { useEffect, useCallback, useRef } from 'react'

const useClickOutside = (
  onClickOutside,
  dom,
  eventName = 'click',
  attachEle
) => {
  const ref = React.createRef('')
  const handleOutside = e => {
    const targetElement = typeof dom === 'function' ? dom() : dom
    const el = targetElement || element.current
    if (el) {
      if (attachEle) {
        !(attachEle.contains(e.target) || el.contains(e.target)) &&
          onClickOutside(e)
      } else {
        !el.contains(e.target) && onClickOutside(e)
      }
    }
  }

  useEffect(() => {
    document.addEventListener(eventName, handleOutside, true)
    return () => {
      document.removeEventListener(eventName, handleOutside, true)
    }
  }, [eventName, onClickOutside, element])
  return element
}
export default useClickOutside
