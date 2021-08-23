import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'

const resolveContainer = (container?: (() => HTMLElement | null) | HTMLElement | null) => {
  if (!container) return null
  if (typeof container === 'function') container = container()
  return container
}

export const useWaitForDOM = (container?: (() => HTMLElement | null) | HTMLElement | null) => {
  const [element, setElement] = useState(() => resolveContainer(container))
  const elementLatestRef = useLatestRef(element)

  useEffect(() => {
    const nextEl = resolveContainer(container)

    if (nextEl !== elementLatestRef.current) {
      setElement(nextEl)
    }
  })

  return element
}

const hiddenStyle: React.CSSProperties = {
  display: 'none',
  position: 'absolute',
}

export const useOwnDocument = () => {
  const [ownDocument, setOwnDocument] = useState<Document | undefined>()
  const [element, setElement] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!element) return

    setOwnDocument(element.ownerDocument)
  }, [element])

  const tempNode = useMemo(
    () => (ownDocument ? null : <span ref={setElement} style={hiddenStyle} />),
    [ownDocument]
  )

  return [ownDocument, tempNode] as const
}
