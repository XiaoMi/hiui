import React from 'react'

export interface CascaderDataItem extends Record<string, any> {
  /**
   * 树节点唯一 id
   */
  id?: React.ReactText
  /**
   * 树节点标题
   */
  title?: React.ReactNode
  /**
   * 该节点的子节点列表
   */
  children?: CascaderDataItem[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用）
   */
  disabled?: boolean
}

// TODO: ts 类型工具函数 将指定属性转为非可选属性
export interface FlattedCascaderItemWithChildren extends FlattedCascaderItem {
  children: FlattedCascaderItem[]
}

export interface FlattedCascaderItem extends Required<Omit<CascaderDataItem, 'children'>> {
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
  children?: FlattedCascaderItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: CascaderDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent: FlattedCascaderItemWithChildren
}

export interface CascaderItemRequiredProps {
  selected: boolean
  loading: boolean
  focused: boolean
}

export interface CascaderItemEventData extends FlattedCascaderItem, CascaderItemRequiredProps {}

export type ExpandTrigger = 'click' | 'hover'

export interface NodeRoot<T> {
  depth: -1
  children: T[]
}
