import React, { useCallback } from 'react'
import { useCascadeCheck } from '@hi-ui/use-check'
import { CheckCascaderItemEventData, FlattedCheckCascaderItem } from '../types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef } from '@hi-ui/use-latest'

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
  const onCheckRef = useLatestRef(onCheck)

  const proxyOnCheck = useCallback((checkedIds, checkedNode, shouldChecked, semiCheckedIds) => {
    onCheckRef.current?.({ checkedIds, semiCheckedIds }, checkedNode, shouldChecked)
  }, [])

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    proxyOnCheck
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
