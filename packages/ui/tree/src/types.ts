import React from 'react'

export interface TreeDataItem {
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
  children?: TreeDataItem[]
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

export interface FlattedTreeNodeData extends TreeDataItem {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedTreeNodeData[]
  /**
   * 关联用户传入的原始节点
   */
  raw: TreeDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedTreeNodeData
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
  /**
   * 更新前整个树的数据结构
   */
  before: TreeDataItem[]
  /**
   * 更新后整个树的数据结构
   */
  after: TreeDataItem[]
}

export type TreeLevelStatus = {
  /**
   * 拖拽前在树中的层级
   */
  before: number
  /**
   * 拖拽后在树中的层级
   */
  after: number
}

export interface MotionTreeNodeData {
  id: React.ReactText
  type: TreeNodeType
  children: FlattedTreeNodeData[]
}

export type TreeNodeTransitionData = MotionTreeNodeData | FlattedTreeNodeData

export interface TreeNodeRequiredProps {
  expanded: boolean
  checked: boolean
  semiChecked: boolean
  selected: boolean
  loading: boolean
  focused: boolean
}

export interface TreeNodeEventData extends FlattedTreeNodeData, TreeNodeRequiredProps {}

export type TreeMenuActionOption = {
  /**
   * 菜单执行的功能
   */
  type?: 'editNode' | 'addChildNode' | 'addSiblingNode' | 'deleteNode'
  /**
   * 菜单标题
   */
  title: React.ReactNode
  /**
   * 菜单执行的功能
   */
  onClick?: (item: FlattedTreeNodeData, action: TreeEditActions) => void
}

export type TreeEditActions = {
  /**
   * 执行编辑节点操作
   */
  editNode: () => void
  /**
   * 执行添加子节点操作
   */
  addChildNode: () => void
  /**
   * 执行添加兄弟节点操作
   */
  addSiblingNode: () => void
  /**
   * 执行删除节点操作
   */
  deleteNode: () => void
  /**
   * 执行关闭菜单操作
   */
  closeMenu: () => void
}
