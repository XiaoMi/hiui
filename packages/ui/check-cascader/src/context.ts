import React, { createContext, useContext } from 'react'
import {
  CheckCascaderExpandTriggerEnum,
  CheckCascaderItemEventData,
  CheckCascaderDataItem,
  FlattedCheckCascaderDataItem,
  CheckCascaderDataItemRequiredProps,
} from './types'

interface CheckCascaderContext {
  onLoadChildren?: (
    item: CheckCascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderDataItem[] | void> | void
  disabled?: boolean
  expandTrigger?: CheckCascaderExpandTriggerEnum
  onCheck?: (option: CheckCascaderItemEventData, shouldChecked: boolean) => void
  onSelect?: (selectedOption: CheckCascaderItemEventData) => void
  flatted?: boolean
  changeOnSelect?: boolean
  titleRender?: (item: CheckCascaderItemEventData) => React.ReactNode
  getCascaderItemRequiredProps?: (
    item: FlattedCheckCascaderDataItem
  ) => CheckCascaderDataItemRequiredProps
  virtual?: boolean
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
