import React, { createContext } from 'react'
import { MenuDataItem } from './types'

/** 供 MenuItem 使用的语义化 classNames/styles，由 Menu 通过 useMergeSemantic 合并后注入 */
export interface MenuSemanticContext {
  semanticClassNames?: Record<string, string | undefined>
  semanticStyles?: Record<string, React.CSSProperties | undefined>
}

const MenuContext = createContext<
  {
    placement?: 'vertical' | 'horizontal'
    expandedType?: 'collapse' | 'pop'
    showAllSubMenus?: boolean
    mini?: boolean
    showTitleOnMini?: boolean
    expandedIds?: React.ReactText[]
    activeId?: React.ReactText
    activeParents?: React.ReactText[]
    overlayClassName?: string
    clickMenu?: (id: React.ReactText, raw: MenuDataItem) => void
    clickSubMenu?: (id: React.ReactText) => void
    closePopper?: (id: React.ReactText) => void
    closeAllPopper?: () => void
  } & MenuSemanticContext
>({})

export default MenuContext
