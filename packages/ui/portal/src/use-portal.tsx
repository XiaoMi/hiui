import React, { useRef, useCallback, useMemo, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getPrefixCls } from '@hi-ui/classname'
import * as Container from '@hi-ui/container'
import { useForceUpdate } from '@hi-ui/use-force-update'
import { useOwnDocument, useWaitForDOM } from './hooks'
import { addDOMClass } from './utils'

const _role = 'portal'
const _prefix = getPrefixCls(_role)

export const usePortal = ({ prefixCls = _prefix, className }: UsePortalProps) => {
  const portalElRef = useRef<Element | null>(null)

  const [doc, tempNode] = useOwnDocument()

  const selectorId = useMemo(() => {
    return `.${prefixCls}-${Math.random().toString(36).substring(5)}`
  }, [prefixCls])

  const [forceUpdate] = useForceUpdate()

  useLayoutEffect(() => {
    if (!doc) return

    const portalEl = Container.getContainer(selectorId, doc)

    addDOMClass(portalEl, className)

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
  }, [className, selectorId, doc, forceUpdate])

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
}

export const useContainerPortal = ({
  className,
  container,
}: UseContainerPortalProps): (({
  children,
}: {
  children: React.ReactNode
}) => React.ReactPortal | null) => {
  const [forceUpdate] = useForceUpdate()

  const portalEl = useWaitForDOM(container)
  const portalElRef = useRef<Element | null>(portalEl)

  useLayoutEffect(() => {
    if (!portalEl) return

    addDOMClass(portalEl, className)

    portalElRef.current = portalEl
    forceUpdate()
  }, [portalEl, className, forceUpdate])

  const Portal = useCallback(({ children }) => {
    return portalElRef.current ? createPortal(children, portalElRef.current) : null
  }, [])

  return Portal
}

export interface UseContainerPortalProps {
  /**
   * 组件的注入选择器类
   */
  className?: string

  /**
   * 指定 portal 位置节点
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
}
