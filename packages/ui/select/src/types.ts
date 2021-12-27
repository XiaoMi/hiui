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

export type SelectItem = SelectDataItem | SelectGroupDataItem
