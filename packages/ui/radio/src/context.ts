import { createContext, useContext } from 'react'
import { RadioGroupTypeEnum } from './types'

import { UseRadioGroupReturn } from './use-radio-group'

const RadioGroupContext = createContext<
  (Omit<UseRadioGroupReturn, 'rootProps'> & { type: RadioGroupTypeEnum }) | null
>(null)

export const RadioGroupProvider = RadioGroupContext.Provider

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext)

  // 允许 Radio 单独存在，不做检查
  // if (!context) {
  // throw new Error('The RadioGroupContext context should using in Radio.')
  // }

  return context
}
