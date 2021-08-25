import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { UseCheckItem } from './types'

export const useCheck = ({
  disabled,
  defaultCheckedIds,
  checkedIds: checkedIdsProp,
  onCheck,
  allowCheck,
}: UseCheckProps) => {
  const onCheckLatest = useLatestCallback(onCheck)

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    onCheckLatest
  )

  const isCheckedId = (id: React.ReactText) => checkedIds.indexOf(id) !== -1

  const allowCheckRef = useLatestRef(allowCheck)
  const checkedIdsRef = useLatestRef(checkedIds)

  const onNodeCheck = useCallback(
    (targetItem: UseCheckItem, shouldChecked: boolean) => {
      if (disabled) return
      if (allowCheckRef.current && allowCheckRef.current(targetItem) === false) return

      const nextCheckedIds = checkDefault(checkedIdsRef.current, targetItem, shouldChecked)

      trySetCheckedIds(nextCheckedIds, targetItem, shouldChecked)
    },
    [disabled, trySetCheckedIds]
  )

  return [checkedIds, onNodeCheck, isCheckedId] as const
}

export interface UseCheckProps {
  disabled: boolean
  defaultCheckedIds: React.ReactText[]
  checkedIds?: React.ReactText[]
  onCheck?: (
    checkedIds: React.ReactText[],
    targetItem: UseCheckItem,
    shouldChecked: boolean
  ) => void
  allowCheck?: (targetItem: UseCheckItem) => boolean
}

/**
 * 普通多选
 */
export const checkDefault = <T extends UseCheckItem>(
  checkedIds: React.ReactText[],
  targetItem: T,
  shouldChecked: boolean
) => {
  let nextCheckedIds = checkedIds
  const targetId = targetItem.id

  if (shouldChecked) {
    if (nextCheckedIds.indexOf(targetId) === -1) {
      nextCheckedIds = nextCheckedIds.concat(targetId)
    }
  } else {
    nextCheckedIds = nextCheckedIds.filter((item) => item !== targetId)
  }

  return nextCheckedIds
}
