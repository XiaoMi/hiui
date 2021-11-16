import { createContext, useContext } from 'react'

import { UseFilterReturn } from './use-filter'

const FilterContext = createContext<Omit<UseFilterReturn, 'rootProps'> | null>(null)

export const FilterProvider = FilterContext.Provider

export const useFilterContext = () => {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error('The FilterContext context should using in Filter.')
  }

  return context
}
