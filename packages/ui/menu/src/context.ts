import { createContext } from 'react'

const MenuContext = createContext<{
  placement?: 'vertical' | 'horizontal'
  expandedType?: 'default' | 'pop'
}>({})

export default MenuContext
