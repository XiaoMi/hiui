import React from 'react'

export type FieldNames = {
  label?: string
  value?: string
  children?: string
}

export interface CascaderItem {
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
  children?: CascaderItem[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否开启 checkbox 功能
   */
  checkable?: boolean
  /**
   * 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用）
   */
  disabled?: boolean
  /**
   * 是否禁用该节点 checkbox 功能
   */
  disabledCheckbox?: boolean
}

// TODO: ts 工具函数
export interface FlattedCascaderItemWithChildren extends FlattedCascaderItem {
  children: FlattedCascaderItem[]
}

export interface FlattedCascaderItem extends Required<Omit<CascaderItem, 'children'>> {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedCascaderItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: CascaderItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent: FlattedCascaderItemWithChildren
  /**
   * 该节点的所有祖先节点列表
   */
  ancestors?: FlattedCascaderItemWithChildren[]
}

export type ExpandTrigger = 'click' | 'hover'

export interface NodeRoot<T> {
  depth: -1
  children: T[]
}
