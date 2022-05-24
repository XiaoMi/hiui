import React, { createContext, useContext } from 'react'
import {
  CheckCascaderExpandTriggerEnum,
  CheckCascadeItemEventData,
  CheckCascaderDataItem,
  FlattedCheckCascaderDataItem,
  CheckCascaderDataItemRequiredProps,
} from './types'

interface CheckCascaderContext {
  onLoadChildren?: (
    item: CheckCascadeItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderDataItem[] | void> | void
  disabled?: boolean
  expandTrigger?: CheckCascaderExpandTriggerEnum
  onCheck?: (option: CheckCascadeItemEventData, shouldChecked: boolean) => void
  onSelect?: (selectedOption: CheckCascadeItemEventData) => void
  flatted?: boolean
  changeOnSelect?: boolean
  titleRender?: (item: CheckCascadeItemEventData) => React.ReactNode
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
