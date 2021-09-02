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
  disabled?: boolean
  expandTrigger?: ExpandTrigger
  onCheck?: (option: CascaderItemEventData, shouldChecked: boolean) => void
  onSelect?: (selectedOption: CascaderItemEventData) => void
  flatted?: boolean
  changeOnSelect?: boolean
  titleRender?: (item: CascaderItemEventData) => React.ReactNode
  getCascaderItemRequiredProps?: (item: FlattedCascaderItem) => CascaderItemRequiredProps
}

const checkCascaderContext = createContext<CascaderContext>({})

export const CascaderProvider = checkCascaderContext.Provider

export const useCascaderContext = () => {
  const context = useContext(checkCascaderContext)

  if (!context) {
    throw new Error('The checkCascaderContext context should using in Cascader.')
  }

  return context
}
