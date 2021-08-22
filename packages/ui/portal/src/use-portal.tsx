import React, { useRef, useCallback, useMemo, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPrefixCls } from '@hi-ui/classname'
import * as Container from '@hi-ui/container'
import { useForceUpdate } from '@hi-ui/use-force-update'

export const usePortal = ({ className, container }: UsePortalProps) => {
  const [doc, tempNode] = useOwnDocument()

  const portalElRef = useRef<Element | undefined>()

  const selectorId = useMemo(() => {
    return '.' + getPrefixCls(Math.random().toString(36).substring(5))
  }, [])

  const [forceUpdate] = useForceUpdate()

  useLayoutEffect(() => {
    if (!doc) return

    const portalEl = resolveContainer(container) || Container.getContainer(selectorId, doc)

    if (className) {
      portalEl.classList.add(className)
    }
    portalElRef.current = portalEl

    forceUpdate()

    return () => {
      if (portalEl.parentElement && portalEl.parentElement.removeChild) {
        portalEl.parentElement.removeChild(portalEl)
      } else {
        Container.removeContainer(selectorId, doc)
      }
      portalElRef.current = undefined
    }
  }, [container, className, selectorId, doc, forceUpdate])

  const Portal = useCallback(
    ({ children }) => {
      return portalElRef.current ? createPortal(children, portalElRef.current) : tempNode
    },
    [tempNode]
  )

  return Portal
}

export interface UsePortalProps {
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 指定 portal 位置节点
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
}

const resolveContainer = (container?: (() => HTMLElement | null) | HTMLElement | null) => {
  if (!container) return null
  if (typeof container === 'function') container = container()
  return container
}

const hiddenStyle: React.CSSProperties = {
  display: 'none',
  position: 'absolute',
}

const useOwnDocument = () => {
  const [ownDocument, setOwnDocument] = useState<Document | undefined>()
  const elementRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!elementRef.current) return

    setOwnDocument(elementRef.current.ownerDocument)

    return () => {
      elementRef.current = null
    }
  }, [])

  const tempNode = useMemo(
    () => (ownDocument ? null : <span ref={elementRef} style={hiddenStyle} />),
    [ownDocument]
  )

  return [ownDocument, tempNode] as const
}
