import React, { createContext, useContext } from 'react'
import {
  ExpandTrigger,
  CheckCascaderItemEventData,
  CheckCascaderItem,
  FlattedCheckCascaderItem,
  CheckCascaderItemRequiredProps,
} from './types'

interface CheckCascaderContext {
  onLoadChildren?: (item: CheckCascaderItemEventData) => Promise<CheckCascaderItem[] | void> | void
  disabled?: boolean
  expandTrigger?: ExpandTrigger
  onCheck?: (option: CheckCascaderItemEventData, shouldChecked: boolean) => void
  onSelect?: (selectedOption: CheckCascaderItemEventData) => void
  flatted?: boolean
  changeOnSelect?: boolean
  titleRender?: (item: CheckCascaderItemEventData) => React.ReactNode
  getCascaderItemRequiredProps?: (item: FlattedCheckCascaderItem) => CheckCascaderItemRequiredProps
}

const checkCascaderContext = createContext<CheckCascaderContext>({})

export const CheckCascaderProvider = checkCascaderContext.Provider

export const useCheckCascaderContext = () => {
  const context = useContext(checkCascaderContext)

  if (!context) {
    throw new Error('The checkCascaderContext context should using in CheckCascader.')
  }

  return context
}
