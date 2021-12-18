// import { DrawerDataItem } from './types'

import React from 'react'

export const useDrawer = ({ ...rest }: UseDrawerProps) => {
  return { rootProps: rest }
}

export interface UseDrawerProps {
  /**
   * 外层挂载节点的样式类
   */
  portalClassName?: string
  /**
   * 弹出层样式类
   */
  overlayClassName?: string
  /**
   * 弹窗大小
   */
  size?: 'sm' | 'md' | 'lg'
  visible?: boolean
  onClose?: () => void
  closeOnEsc?: boolean
  onEscKeyDown?: (event: KeyboardEvent) => void
  /**
   * 是否允许点击蒙层关闭抽屉
   */
  closeOnOverlayClick?: boolean
  onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  closable?: boolean
  extra?: React.ReactNode
  closeIcon?: string
  lockScroll?: boolean
  onAfterOpen?: () => void
  timeout?: number
  onAfterClose?: () => void
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
  onExited?: () => void
  placement?: 'right' | 'left' | 'top' | 'bottom'
}

export type UseDrawerReturn = ReturnType<typeof useDrawer>
