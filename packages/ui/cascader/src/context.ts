import React, { createContext, useContext } from 'react'
import { CascaderItemEventData, CascaderExpandTriggerEnum } from './types'

import { UseCascaderReturn } from './use-cascader'

const cascaderContext = createContext<
  | (Omit<UseCascaderReturn, 'rootProps'> & {
      expandTrigger: CascaderExpandTriggerEnum
      titleRender: (item: CascaderItemEventData) => React.ReactNode
    })
  | null
>(null)

export const CascaderProvider = cascaderContext.Provider

export const useCascaderContext = () => {
  const context = useContext(cascaderContext)

  if (!context) {
    throw new Error('The cascaderContext context should using in Cascader.')
  }

  return context
}
