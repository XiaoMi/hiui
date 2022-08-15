import React from 'react'

export interface AnchorDataItem {
  /**
   * 锚点节点 id 属性值
   */
  id: string
  /**
   * 锚点节点标题
   */
  title: React.ReactNode
  /**
   * 孩子节点
   */
  children?: AnchorDataItem[]
}

export interface FlattedAnchorDataItemWithChildren extends FlattedAnchorDataItem {
  children: FlattedAnchorDataItem[]
}

export interface FlattedAnchorDataItem extends Required<Omit<AnchorDataItem, 'children'>> {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedAnchorDataItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: AnchorDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent: FlattedAnchorDataItemWithChildren
}
