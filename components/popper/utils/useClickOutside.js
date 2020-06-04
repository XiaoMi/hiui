import { useEffect, useCallback, useRef } from 'react'

const useClickOutside = ({ onClickOutside, dom, eventName = 'click' }) => {
  const element = useRef('')
  const handleOutside = useCallback(
    e => {
      const targetElement = typeof dom === 'function' ? dom() : dom
      const el = targetElement || element.current
      if (el.current) {
        !el.current.contains(e.target) && onClickOutside(e)
      }
    },
    [onClickOutside, dom, element]
  )
  useEffect(() => {
    document.addEventListener(eventName, handleOutside)
    return () => {
      document.removeEventListener(eventName, handleOutside)
    }
  }, [eventName, onClickOutside])
  return element
}
export default useClickOutside
