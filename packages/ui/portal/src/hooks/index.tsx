import React, { useMemo, useState, useLayoutEffect } from 'react'

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
