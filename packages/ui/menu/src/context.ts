import { createContext } from 'react'

const MenuContext = createContext<{
  placement?: 'vertical' | 'horizontal'
  expandedType?: 'default' | 'pop'
  showAllSubMenus?: boolean
  mini?: boolean
}>({})

export default MenuContext
