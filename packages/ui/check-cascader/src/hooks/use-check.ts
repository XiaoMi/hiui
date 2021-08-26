import React from 'react'
import { useCascadeCheck } from '@hi-ui/use-check'
import { CheckCascaderItemEventData, FlattedCheckCascaderItem } from '../types'

export const useCheck = (
  cascaded: boolean,
  disabled: boolean,
  flattedData: FlattedCheckCascaderItem[],
  defaultCheckedIds: React.ReactText[],
  checkedIds?: React.ReactText[],
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: CheckCascaderItemEventData,
    checked: boolean
  ) => void
) => {
  return useCascadeCheck({
    cascaded,
    disabled,
    flattedData,
    defaultCheckedIds,
    checkedIds,
    onCheck,
    allowCheck,
  })
}

const allowCheck = (targetItem: CheckCascaderItemEventData) => {
  if (targetItem.disabled || targetItem.disabledCheckbox || targetItem.checkable === false) {
    return false
  }
  return true
}
