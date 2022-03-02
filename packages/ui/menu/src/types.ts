import React from 'react'

export interface MenuDataItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title: React.ReactNode
  /**
   * 菜单项 icon
   */
  icon?: React.ReactNode
  /**
   * 菜单项是否禁止点击
   */
  disabled?: boolean
  /**
   * 子菜单项配置
   */
  children?: MenuDataItem[]
}
