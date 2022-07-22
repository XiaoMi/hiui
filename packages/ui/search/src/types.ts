import React from 'react'

export interface SearchDataItem {
  /**
   * 选项唯一 id
   */
  id: React.ReactText
  /**
   * 选项标题，如果存在 children 则表示分组标题
   */
  title: string
  /**
   * 分组选项列表
   */
  children?: SearchDataItem[]
}
