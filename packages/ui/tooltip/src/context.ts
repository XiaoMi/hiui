import { createContext, useContext } from 'react'

import { UseTooltipReturn } from './use-tooltip'

const TooltipContext = createContext<Omit<UseTooltipReturn, 'rootProps'> | null>(null)

export const TooltipProvider = TooltipContext.Provider

export const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error('The TooltipContext context should using in Tooltip.')
  }

  return context
}
