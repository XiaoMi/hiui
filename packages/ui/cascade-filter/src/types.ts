import React from 'react'

export interface CascadeFilterDataItem {
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
  /**
   * 级联筛选项列表
   */
  children?: CascadeFilterDataItem[]
}

export interface FlattedCascadeFilterDataItem {}

export interface CascadeFilterEventDataItem {}
