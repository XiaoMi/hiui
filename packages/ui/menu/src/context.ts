import React, { createContext } from 'react'
import { MenuDataItem } from './types'

const MenuContext = createContext<{
  placement?: 'vertical' | 'horizontal'
  expandedType?: 'collapse' | 'pop'
  showAllSubMenus?: boolean
  mini?: boolean
  expandedIds?: React.ReactText[]
  activeId?: React.ReactText
  activeParents?: React.ReactText[]
  overlayClassName?: string
  clickMenu?: (id: React.ReactText, raw: MenuDataItem) => void
  clickSubMenu?: (id: React.ReactText) => void
  closePopper?: (id: React.ReactText) => void
  closeAllPopper?: () => void
}>({})

export default MenuContext
