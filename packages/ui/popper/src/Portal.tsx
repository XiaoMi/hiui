import React from 'react'
import { createPortal } from 'react-dom'
import { useWaitDOMRef } from './utils/use-wait-dom-ref'
import { __DEV__ } from '@hi-ui/env'

const getNodeName = (element: Element) => element?.nodeName?.toLowerCase() || ''
const rootElementNames = ['html', 'body', '#document']

const isRootElement = (node: Element) => rootElementNames.includes(getNodeName(node))

/**
 * 指定挂载点
 */
const Portal: React.FC<PortalProps> = ({ container, children, onRendered }) => {
  let resolvedContainer = useWaitDOMRef(container, onRendered)

  resolvedContainer = isRootElement(resolvedContainer) ? document.body : resolvedContainer

  return children && resolvedContainer ? <>{createPortal(children, resolvedContainer)}</> : null
}

if (__DEV__) {
  Portal.displayName = 'Portal'
}

export interface PortalProps {
  container?: Element
  children: Element
  onRendered: any
}
