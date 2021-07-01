import { useState, useEffect } from 'react'

// 作用
const resolveContainerRef = (ref: any) => {
  if (typeof document === 'undefined') return null

  if (ref == null) return document.body

  if (typeof ref === 'function') ref = ref()

  if (ref && 'current' in ref) ref = ref.current

  if (ref && ref.nodeType) return ref

  return null
}

export function useWaitDOMRef(ref: any, onResolved: any) {
  // TODO: 为什么函数包裹
  const [resolvedRef, setRef] = useState(() => resolveContainerRef(ref))

  if (!resolvedRef) {
    const earlyRef = resolveContainerRef(ref)
    if (earlyRef) setRef(earlyRef)
  }

  useEffect(() => {
    if (onResolved && resolvedRef) {
      onResolved(resolvedRef)
    }
  }, [onResolved, resolvedRef])

  useEffect(() => {
    const nextRef = resolveContainerRef(ref)
    if (nextRef !== resolvedRef) {
      setRef(nextRef)
    }
  }, [ref, resolvedRef])

  return resolvedRef
}
