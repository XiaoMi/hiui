import React, { useCallback, useState } from 'react'
import { CascaderItemEventData, FlattedCascaderItem } from '../types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { getTopDownAncestors } from '../utils'

/**
 * 用于选中的 hook
 */
export const useSelect = (
  onSelect: (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderItem[]
  ) => void
) => {
  const onSelectLatest = useLatestCallback(onSelect)

  const [selectedId, setSelectedId] = useState<React.ReactText>('')

  const proxyOnSelect = useCallback(
    (selectedId: React.ReactText, selectOption: CascaderItemEventData) => {
      const optionPaths = getTopDownAncestors(selectOption)

      // 选择末级
      onSelectLatest(selectedId, selectOption, optionPaths)
    },
    [onSelectLatest]
  )

  const onItemSelect = useCallback(
    (targetItem: CascaderItemEventData) => {
      if (targetItem.disabled) return

      setSelectedId(targetItem.id)
      proxyOnSelect(targetItem.id, targetItem)
    },
    [proxyOnSelect]
  )

  return [selectedId, onItemSelect, setSelectedId] as const
}
