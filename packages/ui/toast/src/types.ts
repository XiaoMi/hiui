import React from 'react'

export type ToastPlacement = 'top' | 'bottom' | 'center'

export interface ToastEventOptions {
  /**
   * toast 唯一标识
   */
  id?: React.ReactText
  /**
   * toast 默认展示 title
   */
  title?: React.ReactNode
}


export interface ToastOptions extends ToastEventOptions {
  /**
   * 内部使用，勿覆盖
   */
  $destroy: () => void
}
