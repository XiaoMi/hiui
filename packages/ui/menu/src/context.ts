import { createContext } from 'react'

const MenuContext = createContext<{
  placement?: 'vertical' | 'horizontal'
  expandedType?: 'default' | 'pop'
  showAllSubMenus?: boolean
}>({})

export default MenuContext
