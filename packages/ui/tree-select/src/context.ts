import { createContext, useContext } from 'react'

const TreeSelectContext = createContext<any | null>(null)

export const TreeSelectProvider = TreeSelectContext.Provider

export const useTreeSelectContext = () => {
  const context = useContext(TreeSelectContext)

  if (!context) {
    throw new Error('The TreeSelectContext context should using in TreeSelect.')
  }

  return context
}
