import React from 'react'

export interface TreeNodeData {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title: React.ReactNode
  /**
   * 该节点的子节点列表
   */
  children?: TreeNodeData[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否禁用该节点
   */
  disabled?: boolean
}

export interface FlattedTreeNodeData extends TreeNodeData {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedTreeNodeData[]
  /**
   * 关联用户传入的原始节点
   */
  raw: TreeNodeData
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedTreeNodeData
  /**
   * 该节点的所有祖先节点列表
   */
  ancestors?: FlattedTreeNodeData[]
  /**
   * 该节点的兄弟节点列表，注意其中包含节点本身
   */
  siblings?: TreeNodeData[]
}

type ValueOf<T> = T[keyof T]

// 表示拖拽
export const TreeNodeDragDirection = {
  BEFORE: 'BEFORE',
  INSIDE: 'INSIDE',
  AFTER: 'AFTER',
} as const

// eslint-disable-next-line no-redeclare
export type TreeNodeDragDirection = ValueOf<typeof TreeNodeDragDirection> | null

export type TreeDataStatus = {
  before: FlattedTreeNodeData[]
  after: FlattedTreeNodeData[]
}

export type TreeLevelStatus = {
  before: number
  after: number
}
