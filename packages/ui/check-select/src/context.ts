import { createContext, useContext } from 'react'

import { UseSelectReturn } from './use-check-select'

const checkSelectContext = createContext<Omit<UseSelectReturn, 'rootProps'> | null>(null)

export const CheckSelectProvider = checkSelectContext.Provider

export const useCheckSelectContext = () => {
  const context = useContext(checkSelectContext)

  if (!context) {
    throw new Error('The checkSelectContext context should using in CheckSelect.')
  }

  return context
}
