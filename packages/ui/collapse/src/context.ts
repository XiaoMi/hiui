import { createContext, useContext } from 'react'

export interface ICollapseContext {
  judgeIsActive: (id: string) => boolean
  onClickPanel: (id: string) => void
  arrowPlacement: 'left' | 'right'
  showArrow: boolean
}

const context = createContext<ICollapseContext>({
  arrowPlacement: 'right',
  showArrow: true,
  judgeIsActive: (_id) => false,
  onClickPanel: (_id) => {
    // default
  },
})

export const CollapseProvider = context.Provider

export const useCollapseContext = () => {
  const data = useContext(context)

  if (!data) {
    throw new Error('Collapse.BasePanel must be the child of the Collapse')
  }

  return data
}
