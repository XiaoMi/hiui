import { useState, useEffect } from 'react'

const ownerDocument = node => {
  return (node && node.ownerDocument) || document
}
export const resolveContainerRef = ref => {
  if (typeof document === 'undefined') return null
  if (ref == null) return ownerDocument().body
  if (typeof ref === 'function') ref = ref()

  if (ref && 'current' in ref) ref = ref.current
  if (ref && ref.nodeType) return ref || null

  return null
}

export default function useWaitForDOMRef (ref, onResolved) {
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
