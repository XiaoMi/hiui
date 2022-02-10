import React from 'react'
import { useCascadeCheck } from '@hi-ui/use-check'
import { CheckCascaderItemEventData, FlattedCheckCascaderItem } from '../types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const NOOP_ARRAY = [] as []

export const useCheck = (
  cascaded: boolean,
  disabled: boolean,
  flattedData: FlattedCheckCascaderItem[],
  defaultCheckedIds: React.ReactText[] = NOOP_ARRAY,
  checkedIdsProp?: React.ReactText[],
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: CheckCascaderItemEventData,
    checked: boolean
  ) => void
) => {
  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    (checkedIds, checkedNode, shouldChecked, semiCheckedIds) => {
      onCheck?.({ checkedIds, semiCheckedIds }, checkedNode, shouldChecked)
    }
  )

  return useCascadeCheck({
    cascaded,
    disabled,
    flattedData,
    checkedIds,
    onCheck: trySetCheckedIds,
    allowCheck,
  })
}

const allowCheck = (targetItem: CheckCascaderItemEventData) => {
  if (targetItem.disabled || targetItem.disabledCheckbox || targetItem.checkable === false) {
    return false
  }
  return true
}
