import React from 'react'

export interface MenuDataItem {
  /**
   * 菜单项唯一标识
   */
  id: React.ReactText
  /**
   * 菜单项标题
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
