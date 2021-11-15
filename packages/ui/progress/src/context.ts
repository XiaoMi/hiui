import { createContext, useContext } from 'react'

import { UseProgressReturn } from './use-progress'

const ProgressContext = createContext<Omit<UseProgressReturn, 'rootProps'> | null>(null)

export const ProgressProvider = ProgressContext.Provider

export const useProgressContext = () => {
  const context = useContext(ProgressContext)

  if (!context) {
    throw new Error('The ProgressContext context should using in Progress.')
  }

  return context
}
