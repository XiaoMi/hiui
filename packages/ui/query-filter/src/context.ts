import { createContext, useContext } from 'react'

export const FilterContext = createContext<{
  selectedCacheData: Map<string, unknown[]>
  setSelectedCacheData: (data: Map<string, unknown[]>) => void
}>({
  selectedCacheData: new Map(),
  setSelectedCacheData: () => {
    console.log('setSelectedCacheData')
  },
})

export const FilterProvider = FilterContext.Provider

export const useFilterContext = () => {
  return useContext(FilterContext)
}
