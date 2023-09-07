import React from 'react'

export interface ListDataItem {
  /**
   * 列表元素的标题
   */
  title?: React.ReactNode
  /**
   * 列表元素的描述内容
   */
  description?: React.ReactNode
  /**
   * 额外内容
   */
  extra?: React.ReactNode
  /**
   * 左侧图片
   */
  avatar?: React.ReactNode
  /**
   * 右侧操作项
   */
  action?: React.ReactNode
  /**
   * 右侧操作项垂直对齐位置
   */
  actionPlacement?: ListActionPlacementEnum
}

export type ListPaginationPlacementEnum = 'left' | 'middle' | 'right'

export type ListActionPlacementEnum = 'top' | 'center' | 'bottom'
