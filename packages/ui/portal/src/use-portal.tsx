import React, { useRef, useCallback, useMemo, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPrefixCls } from '@hi-ui/classname'
import * as Container from '@hi-ui/container'
import { useForceUpdate } from '@hi-ui/use-force-update'

const _role = 'portal'
const _prefix = getPrefixCls(_role)

export const usePortal = ({ prefixCls = _prefix, className, container }: UsePortalProps) => {
  const [doc, tempNode] = useOwnDocument()

  const portalElRef = useRef<Element | null>(null)

  const selectorId = useMemo(() => {
    return `.${prefixCls}-${Math.random().toString(36).substring(5)}`
  }, [prefixCls])

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
      portalElRef.current = null
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
   * 组件默认的选择器类
   */
  prefixCls?: string
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
