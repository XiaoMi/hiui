import React, { useCallback, useState } from 'react'
import { CascaderItemEventData, FlattedCascaderDataItem } from '../types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { getTopDownAncestors } from '@hi-ui/tree-utils'
import { checkCanLoadChildren } from '../utils'

/**
 * 用于选中的 hook
 */
export const useSelect = (
  disabled: boolean,
  onSelect: (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderDataItem[]
  ) => void,
  changeOnSelect: boolean,
  onLoadChildren?: (item: CascaderItemEventData, idPaths: React.ReactText[]) => void,
  value?: React.ReactText
) => {
  const onSelectLatest = useLatestCallback(onSelect)

  const [selectedId, setSelectedId] = useState<React.ReactText>(value ?? '')

  const proxyOnSelect = useCallback(
    (selectedId: React.ReactText, selectOption: CascaderItemEventData) => {
      const optionPaths = getTopDownAncestors(selectOption)

      if (changeOnSelect) {
        // 任意选中
        onSelectLatest(selectedId, selectOption, optionPaths)
      } else {
        // 选择末级
        const canLoadChildren = checkCanLoadChildren(selectOption, onLoadChildren)
        if (canLoadChildren) return

        onSelectLatest(selectedId, selectOption, optionPaths)
      }
    },
    [changeOnSelect, onLoadChildren, onSelectLatest]
  )

  const onItemSelect = useCallback(
    (targetItem: CascaderItemEventData, onlyExpand: boolean) => {
      if (disabled) return
      if (targetItem.disabled) return

      if (onlyExpand) {
        // 仅展开，不做选中处理
        const canLoadChildren = checkCanLoadChildren(targetItem, onLoadChildren)

        if (canLoadChildren) {
          setSelectedId(targetItem.id)
        }
      } else {
        setSelectedId(targetItem.id)
        proxyOnSelect(targetItem.id, targetItem)
      }
    },
    [disabled, proxyOnSelect, onLoadChildren]
  )

  return [selectedId, onItemSelect, setSelectedId] as const
}
