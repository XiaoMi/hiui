import React, { createContext, useContext } from 'react'
import { CascaderItemEventData, ExpandTrigger } from './types'

import { UseCascaderReturn } from './use-cascader'

const cascaderContext = createContext<
  | (Omit<UseCascaderReturn, 'rootProps'> & {
      expandTrigger: ExpandTrigger
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
