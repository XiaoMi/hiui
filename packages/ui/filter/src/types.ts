import React from 'react'

export interface FilterDataItem {
  /**
   * 选项对应的值，唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title?: React.ReactNode
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 级联筛选项列表
   */
  children?: FilterDataItem[]
}
