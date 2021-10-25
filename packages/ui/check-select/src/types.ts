import React from 'react'

export interface CheckSelectOptionItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title?: React.ReactNode
  /**
   * 是否禁用该节点
   */
  disabled?: boolean
}

export interface CheckSelectOptionGroupItem {
  /**
   * 节点组标题
   */
  groupTitle?: React.ReactNode
  /**
   * 是否禁用该节点
   */
  children?: CheckSelectOptionItem[]
}

export type CheckSelectOptionOrOptionGroupItem = CheckSelectOptionItem & CheckSelectOptionGroupItem
