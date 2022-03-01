import React from 'react'

export interface SearchDataItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title: string
  /**
   * 孩子节点
   */
  children?: SearchDataItem[]
}
