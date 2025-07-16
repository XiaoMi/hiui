import React from 'react'
import type { HiBaseAppearanceEnum } from '@hi-ui/core'

export interface SelectDataItem {
  /**
   * 选择项值，唯一 id
   */
  id: React.ReactText
  /**
   * 选项标题
   */
  title: React.ReactNode
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
}

export interface SelectGroupDataItem {
  /**
   *   选项组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 选项组唯一 id
   */
  groupId?: React.ReactText
  /**
   * 分组下选项列表
   */
  children?: SelectDataItem[]
}

export type SelectMergedItem = SelectDataItem | SelectGroupDataItem

export interface FlattedSelectDataItem extends SelectDataItem {
  /**
   * 关联用户传入的原始节点
   */
  raw: SelectMergedItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth?: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedSelectDataItem
  /**
   * 该节点的子节点列表
   */
  children?: FlattedSelectDataItem[]
}

export interface SelectItemRequiredProps {
  selected: boolean
  focused: boolean
}

export interface SelectItemEventData extends FlattedSelectDataItem, SelectItemRequiredProps {}

export type SelectAppearanceEnum = HiBaseAppearanceEnum | 'contained' | undefined
