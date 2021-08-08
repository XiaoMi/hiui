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
  /**
   * 节点类型，控制操作节点的行为
   */
  type?: TreeNodeType
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
   * 该节点的兄弟节点列表（其中包含节点本身）
   */
  siblings?: TreeNodeData[]
  /**
   * 节点类型，控制操作节点的行为
   */
  type?: TreeNodeType
  /**
   * 节点所在列表数据中的下标
   */
  pos?: number
}

type ValueOf<T> = T[keyof T]

// 表示拖拽
export const TreeNodeDragDirection = {
  BEFORE: 'before',
  INSIDE: 'inside',
  AFTER: 'after',
} as const

// eslint-disable-next-line no-redeclare
export type TreeNodeDragDirection = ValueOf<typeof TreeNodeDragDirection> | null

// 表示节点类型
export const TreeNodeType = {
  SHOW: 'show',
  HIDE: 'hide',
  ADD: 'add',
} as const

// eslint-disable-next-line no-redeclare
export type TreeNodeType = ValueOf<typeof TreeNodeType>

export type TreeDataStatus = {
  before: TreeNodeData[]
  after: TreeNodeData[]
}

export type TreeLevelStatus = {
  before: number
  after: number
}

export interface MotionTreeNodeData {
  id: React.ReactText
  type: TreeNodeType
  children: FlattedTreeNodeData[]
}

export type TreeNodeTransitionData = MotionTreeNodeData | FlattedTreeNodeData

export interface TreeNodeEventData extends FlattedTreeNodeData {
  expanded: boolean
  checked: boolean
  semiChecked: boolean
  selected: boolean
  loading: boolean
}
