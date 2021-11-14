import { createContext, useContext } from 'react'

import { UseRadioReturn } from './use-radio'

const RadioContext = createContext<Omit<UseRadioReturn, 'rootProps'> | null>(null)

export const RadioProvider = RadioContext.Provider

export const useRadioContext = () => {
  const context = useContext(RadioContext)

  if (!context) {
    throw new Error('The RadioContext context should using in Radio.')
  }

  return context
}
