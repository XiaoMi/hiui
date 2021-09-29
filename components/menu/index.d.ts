import React from 'react'

export type MenuItem = {
  content: string | JSX.Element
  icon?: string | JSX.Element
  id: string | number
  disabled?: boolean
  children?: MenuItem[]
}
export interface MenuProps {
  data: MenuItem[]
  activeId?: string | number
  placement?: 'horizontal' | 'vertical'
  collapsed?: boolean
  showCollapse?: boolean
  showAllSubMenus?: boolean
  accordion?: boolean
  style?: React.CSSProperties
  className?: string
  onClick?: (activeId: string | number, prevActiveId: string | number) => void
  onClickSubMenu?: (subMenuIndexs: number) => void
  onCollapse?: (collapsed: boolean) => void
  overlayClassName?: string
}
declare const Menu: React.ComponentType<MenuProps>
export default Menu
