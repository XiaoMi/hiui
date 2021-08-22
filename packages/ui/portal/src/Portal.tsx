import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { usePortal } from './use-portal'

/**
 * TODO: What is Portal
 */
export const Portal = (props: PortalProps) => {
  const { className, disabled, container, children } = props

  const InternalPortal = usePortal({ container, className })

  return disabled ? children : <InternalPortal>{children}</InternalPortal>
}

export interface PortalProps {
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * portal 内容
   */
  children?: React.ReactNode
  /**
   * 指定 portal 位置节点
   */
  container: (() => HTMLElement | null) | HTMLElement | null
  /**
   * 是否关闭传送
   */
  disabled?: boolean
}

if (__DEV__) {
  Portal.displayName = 'Portal'
}
