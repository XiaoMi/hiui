import React from 'react'

export interface CheckSelectDataItem {
  /**
   * 节点唯一 id
   */
  id?: React.ReactText
  /**
   * 节点标题
   */
  title?: React.ReactNode
  /**
   * 是否禁用该节点
   */
  disabled?: boolean
}

export interface CheckSelectGroupDataItem {
  /**
   * 节点组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 是否禁用该节点
   */
  children?: CheckSelectDataItem[]
}

export type CheckSelectMergedItem = CheckSelectDataItem & CheckSelectGroupDataItem

export interface CheckSelectRequiredProps {
  checked: boolean
  focused: boolean
}

export interface FlattedCheckSelectDataItem extends CheckSelectDataItem {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedCheckSelectDataItem[]
  /**
   * 关联用户传入的原始节点
   */
  raw: CheckSelectDataItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedCheckSelectDataItem
}

export interface CheckSelectEventData
  extends FlattedCheckSelectDataItem,
    CheckSelectRequiredProps {}
