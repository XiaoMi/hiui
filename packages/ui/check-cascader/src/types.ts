import React from 'react'
import type { HiBaseAppearanceEnum } from '@hi-ui/core'
export interface CheckCascaderDataItem {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title?: React.ReactNode
  /**
   * 该节点的子节点列表
   */
  children?: CheckCascaderDataItem[]
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

// TODO: ts 类型工具函数 将指定属性转为非可选属性
export interface FlattedCheckCascaderDataItemWithChildren extends FlattedCheckCascaderDataItem {
  children: FlattedCheckCascaderDataItem[]
}

export interface FlattedCheckCascaderDataItem
  extends Required<Omit<CheckCascaderDataItem, 'children'>> {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedCheckCascaderDataItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: CheckCascaderDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent: FlattedCheckCascaderDataItemWithChildren
}

export interface CheckCascaderDataItemRequiredProps {
  selected: boolean
  checked: boolean
  semiChecked: boolean
  loading: boolean
  // focused: boolean
}

export interface CheckCascaderItemEventData
  extends FlattedCheckCascaderDataItem,
    CheckCascaderDataItemRequiredProps {}

export type CheckCascaderExpandTriggerEnum = 'click' | 'hover'

export type CheckCascaderAppearanceEnum = HiBaseAppearanceEnum | 'contained' | undefined
