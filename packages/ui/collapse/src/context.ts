import { createContext, useContext } from 'react'
import { CollapseProps } from './Collapse'

export interface CollapseContext
  extends Pick<CollapseProps, 'arrowPlacement' | 'showArrow' | 'arrowRender'> {
  judgeIsActive: (id: string) => boolean
  onClickPanel: (id: string) => void
}

const collapseContext = createContext<CollapseContext | null>(null)

export const CollapseProvider = collapseContext.Provider

export const useCollapseContext = () => {
  const context = useContext(collapseContext)

  if (!context) {
    throw new Error('The CollapseContext context is not defined.')
  }

  return context
}
