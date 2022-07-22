import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { usePortal, useContainerPortal } from './use-portal'

/**
 * TODO: What is Portal
 */
export const Portal = (props: PortalProps) => {
  const { className, disabled, container, children } = props

  if (disabled) return children as React.ReactElement | null

  if (!children) return null

  return container === undefined ? (
    <DefaultPortal className={className}>{children}</DefaultPortal>
  ) : (
    <ContainerPortal className={className} container={container}>
      {children}
    </ContainerPortal>
  )
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
  container?: (() => HTMLElement | null) | HTMLElement | null
  /**
   * 是否关闭传送
   */
  disabled?: boolean
}

if (__DEV__) {
  Portal.displayName = 'Portal'
}

const DefaultPortal = ({ className, children }: PortalProps) => {
  const InternalPortal = usePortal({ className })
  return <InternalPortal>{children}</InternalPortal>
}

const ContainerPortal = ({ className, container, children }: PortalProps) => {
  const InternalPortal = useContainerPortal({ className, container })
  return <InternalPortal>{children}</InternalPortal>
}
