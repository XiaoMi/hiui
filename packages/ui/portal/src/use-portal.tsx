import React, { useRef, useCallback, useMemo, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPrefixCls } from '@hi-ui/classname'
import * as Container from '@hi-ui/container'
import { useForceUpdate } from '@hi-ui/use-force-update'

export const usePortal = ({ className, container, disabled = false }: UsePortalProps) => {
  const [doc, tempNode] = useOwnDocument()

  const portalElRef = useRef<Element | undefined>()

  const selectorId = useMemo(() => {
    return '.' + getPrefixCls(Math.random().toString(36).substring(5))
  }, [])

  const [forceUpdate] = useForceUpdate()

  useLayoutEffect(() => {
    if (disabled) return

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
  }, [container, className, selectorId, doc, forceUpdate, disabled])

  const Portal = useCallback(
    ({ children }) => {
      if (disabled) return null

      return portalElRef.current ? createPortal(children, portalElRef.current) : tempNode
    },
    [tempNode, disabled]
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
  /**
   * 是否关闭传送
   */
  disabled?: boolean
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
