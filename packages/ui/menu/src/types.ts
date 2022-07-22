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

export interface MenuFooterRenderProps {
  /**
   * 当前菜单收起状态
   */
  collapsed?: boolean
  /**
   * 当前菜单收缩控制器节点
   */
  collapseNode?: React.ReactNode
}
