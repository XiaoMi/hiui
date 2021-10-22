import React from 'react'

export interface CheckSelectOptionItem {
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

export interface CheckSelectOptionGroupItem {
  /**
   * 树节点标题
   */
  groupTitle?: React.ReactNode
  /**
   * 是否禁用该节点（将禁用级联点击，展开，如果开启 checkbox，也将被禁用）
   */
  children?: CheckSelectOptionItem[]
}

export type CheckSelectOptionOrOptionGroupItem = CheckSelectOptionItem & CheckSelectOptionGroupItem
