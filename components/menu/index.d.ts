type DataItem = {
  content: string | JSX.Element
  icon?: string | JSX.Element
  id: string | number
  disabled?: boolean
  children?: DataItem[]
}
interface Props {
  data: DataItem[]
  activeId?: string | number
  placement?: 'horizontal' | 'vertical'
  collapsed?: boolean
  showCollapse?: boolean
  showAllSubMenus?: boolean
  accordion?: boolean
  onClick?: (activeId: string | number, prevActiveId: string | number) => void
  onClickSubMenu?: (subMenuIndexs: number) => void
  onCollapse?: (collapsed: boolean) => void
}
declare const Menu: React.ComponentType<Props>
export default Menu
