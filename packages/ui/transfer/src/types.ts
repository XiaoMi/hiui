import React from 'react'

export type TransferDataItem = {
  /**
   * 选项值，唯一 id
   */
  id: React.ReactText
  /**
   * 选项显示内容
   */
  title?: React.ReactNode
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
}
