import { useEffect } from 'react'

export default function useClickOutside (ref, handler, iconRef) {
  function handleClickOutside (event) {
    if (ref.current && !ref.current.contains(event.target) && iconRef.current && !iconRef.current.contains(event.target)) {
      handler()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}
