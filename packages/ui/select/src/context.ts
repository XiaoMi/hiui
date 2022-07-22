import { createContext, useContext } from 'react'

import { UseSelectReturn } from './use-select'

const selectContext = createContext<Omit<UseSelectReturn, 'rootProps'> | null>(null)

export const SelectProvider = selectContext.Provider

export const useSelectContext = () => {
  const context = useContext(selectContext)

  if (!context) {
    throw new Error('The selectContext context should using in Cascader.')
  }

  return context
}
