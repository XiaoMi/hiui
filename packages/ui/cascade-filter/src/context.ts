import { createContext, useContext } from 'react'

import { UseCascadeFilterReturn } from './use-cascade-filter'

const CascadeFilterContext = createContext<Omit<UseCascadeFilterReturn, 'rootProps'> | null>(null)

export const CascadeFilterProvider = CascadeFilterContext.Provider

export const useCascadeFilterContext = () => {
  const context = useContext(CascadeFilterContext)

  if (!context) {
    throw new Error('The CascadeFilterContext context should using in CascadeFilter.')
  }

  return context
}
