import { createContext, useContext } from 'react'

import { UseTreeSelectReturn } from './use-tree-select'

const TreeSelectContext = createContext<Omit<UseTreeSelectReturn, 'rootProps'> | null>(null)

export const TreeSelectProvider = TreeSelectContext.Provider

export const useTreeSelectContext = () => {
  const context = useContext(TreeSelectContext)

  if (!context) {
    throw new Error('The TreeSelectContext context should using in TreeSelect.')
  }

  return context
}
