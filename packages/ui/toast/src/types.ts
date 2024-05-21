import React from 'react'

export type ToastPlacement = 'top' | 'bottom' | 'center'

export interface ToastEventOptions {
  /**
   * id 值，与用户传入兼容
   */
  id?: React.ReactText
  /**
   * toast 全局唯一标识，用于同步渲染时组件更新
   */
  key?: React.ReactText
  /**
   * toast 默认展示 title
   */
  title?: React.ReactNode
  /**
   * 指定portal挂载的容器
   */
  container?: Element | undefined
}

export interface ToastOptions extends ToastEventOptions {
  /**
   * 内部使用，勿覆盖
   */
  destroy: () => void
}
