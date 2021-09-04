import React, { createContext, useContext } from 'react'
import {
  ExpandTrigger,
  CascaderItemEventData,
  CascaderItem,
  FlattedCascaderItem,
  CascaderItemRequiredProps,
} from './types'

interface CascaderContext {
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
  disabled: boolean
  expandTrigger: ExpandTrigger
  onSelect: (selectedOption: CascaderItemEventData) => void
  flatted: boolean
  changeOnSelect: boolean
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
  getCascaderItemRequiredProps: (item: FlattedCascaderItem) => CascaderItemRequiredProps
}

const cascaderContext = createContext<CascaderContext | null>(null)

export const CascaderProvider = cascaderContext.Provider

export const useCascaderContext = () => {
  const context = useContext(cascaderContext)

  if (!context) {
    throw new Error('The cascaderContext context should using in Cascader.')
  }

  return context
}
