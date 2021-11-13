import React from 'react'

export interface FilterDataItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  content?: React.ReactNode
  /**
   * 是否禁用
   */
  disabled?: boolean
}
