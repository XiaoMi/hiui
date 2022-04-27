import React, { createContext, useContext } from 'react'
import {
  ExpandTrigger,
  CheckCascaderDataItemEventData,
  CheckCascaderDataItem,
  FlattedCheckCascaderDataItem,
  CheckCascaderDataItemRequiredProps,
} from './types'

interface CheckCascaderContext {
  onLoadChildren?: (
    item: CheckCascaderDataItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderDataItem[] | void> | void
  disabled?: boolean
  expandTrigger?: ExpandTrigger
  onCheck?: (option: CheckCascaderDataItemEventData, shouldChecked: boolean) => void
  onSelect?: (selectedOption: CheckCascaderDataItemEventData) => void
  flatted?: boolean
  changeOnSelect?: boolean
  titleRender?: (item: CheckCascaderDataItemEventData) => React.ReactNode
  getCascaderItemRequiredProps?: (
    item: FlattedCheckCascaderDataItem
  ) => CheckCascaderDataItemRequiredProps
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
