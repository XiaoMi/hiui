import React from 'react'
import { useCascadeCheck } from '@hi-ui/use-check'
import { CascaderItemEventData, FlattedCascaderItem } from '../types'

export const useCheck = (
  cascaded: boolean,
  disabled: boolean,
  flattedData: FlattedCascaderItem[],
  defaultCheckedIds: React.ReactText[],
  checkedIds?: React.ReactText[],
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: CascaderItemEventData,
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

const allowCheck = (targetItem: CascaderItemEventData) => {
  if (targetItem.disabled || targetItem.disabledCheckbox || targetItem.checkable === false) {
    return false
  }
  return true
}
