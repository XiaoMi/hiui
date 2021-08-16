import React, { useCallback, useState } from 'react'
import { CheckCascaderItemEventData } from '../types'

/**
 * 用于选中的 hook
 *
 * @param disabled
 * @returns
 */
export const useSelect = (disabled: boolean) => {
  const [selectedId, setSelectedId] = useState<React.ReactText | undefined>()

  const onOptionSelect = useCallback(
    (selectedOption: CheckCascaderItemEventData) => {
      if (disabled || selectedOption.disabled) return

      setSelectedId(selectedOption.id)
    },
    [disabled]
  )

  return [selectedId, onOptionSelect] as const
}
