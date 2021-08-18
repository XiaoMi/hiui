import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CheckCascaderItemEventData } from '../types'

export const useCheck = (
  defaultValue: React.ReactText[],
  value?: React.ReactText[],
  onChange?: (
    values: React.ReactText[],
    checkedOption: CheckCascaderItemEventData,
    checked: boolean
  ) => void
) => {
  const [checkedIds, tryChangeCheckedIds] = useUncontrolledState(defaultValue, value, onChange)

  const onOptionCheck = useCallback(
    (option: CheckCascaderItemEventData, shouldChecked: boolean) => {
      if (!option.checkable || option.disabledCheckbox) return

      let nextCheckedIds = checkedIds

      if (shouldChecked) {
        if (nextCheckedIds.indexOf(option.id) === -1) {
          nextCheckedIds = nextCheckedIds.concat(option.id)
        }
      } else {
        nextCheckedIds = nextCheckedIds.filter((item) => item !== option.id)
      }

      tryChangeCheckedIds(nextCheckedIds)
    },
    [checkedIds, tryChangeCheckedIds]
  )

  return [checkedIds, onOptionCheck] as const
}
