import React from 'react'

export interface SelectDataItem {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title: React.ReactNode
  /**
   * 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用）
   */
  disabled?: boolean
}

export interface SelectGroupDataItem {
  /**
   *   下拉选项组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 下拉选项组唯一 id
   */
  groupId?: React.ReactText
  /**
   * 分组的时候使用	DataIt
   */
  children?: SelectDataItem[]
}

export type SelectMergedItem = SelectDataItem | SelectGroupDataItem

/**
 * 设置模型数据读取映射
 */
export type FieldNames = {
  id?: string
  title?: string
  disabled?: string
  children?: string
}

export type FieldNamesKeys = keyof FieldNames

export interface FlattedSelectItem extends SelectDataItem {
  /**
   * 关联用户传入的原始节点
   */
  raw: SelectMergedItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedSelectItem
  /**
   * 该节点的子节点列表
   */
  children?: FlattedSelectItem[]
}

export interface SelectItemRequiredProps {
  selected: boolean
  focused: boolean
}

export interface SelectItemEventData extends FlattedSelectItem, SelectItemRequiredProps {}
