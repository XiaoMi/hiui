import { createContext, useContext } from 'react'

interface GridContext {
  columns?: number
}

const gridContext = createContext<GridContext>({})

export const GridProvider = gridContext.Provider

export const useGridContext = () => {
  const context = useContext(gridContext)

  if (!context) {
    throw new Error('The GridContext context is not defined, Maybe it should be wrapped in Row.')
  }

  return context
}
