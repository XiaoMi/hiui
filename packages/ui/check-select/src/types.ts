import React from 'react'
import type { HiBaseAppearanceEnum } from '@hi-ui/core'

export interface CheckSelectDataItem {
  /**
   * 选择项值，唯一 id
   */
  id?: React.ReactText
  /**
   * 选项标题
   */
  title?: React.ReactNode
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
}

export interface CheckSelectGroupDataItem {
  /**
   * 选项组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 组选项列表
   */
  children?: CheckSelectDataItem[]
}

export type CheckSelectMergedItem = CheckSelectDataItem | CheckSelectGroupDataItem

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

export interface CheckSelectItemEventData
  extends FlattedCheckSelectDataItem,
    CheckSelectRequiredProps {}

export type CheckSelectAppearanceEnum = HiBaseAppearanceEnum | 'contained' | undefined

/**
 * CheckSelect 通过 innerRef 暴露的辅助方法
 */
export interface CheckSelectHelper {
  /**
   * 全选/取消全选当前列表中的可选项
   * @param checked 默认 true：全选；传 false 时取消全选
   */
  checkAll: (checked?: boolean) => void
  /**
   * 仅显示已选 / 显示全部
   * @param onlyChecked 默认 true：仅显示已选项并打开下拉；传 false 时显示全部（并打开下拉）
   */
  showOnlyChecked: (onlyChecked?: boolean) => void
}
