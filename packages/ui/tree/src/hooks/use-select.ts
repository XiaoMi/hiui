import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedTreeNodeData } from '../types'

/**
 * 一个用于 tree 组件选中的 hook
 *
 * @param defaultSelectedId 非受控默认选中的 id，其值默认为 `null`，表示不选中任何实体
 * @param selectedIdProp
 * @param onSelectProp
 * @param disabled
 * @returns
 */
export const useSelect = (
  defaultSelectedId: React.ReactText | null = null,
  selectedIdProp?: React.ReactText | null,
  onSelectProp?: (
    selectedId: React.ReactText | null,
    selectedNode: FlattedTreeNodeData | null
  ) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (id: React.ReactText | null, item: FlattedTreeNodeData | null) => {
      onSelectProp?.(id, item)
    },
    [onSelectProp]
  )

  const [selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedIdProp,
    proxyOnSelect
  )

  const onSelect = useCallback(
    (selectedItem: FlattedTreeNodeData) => {
      if (disabled || selectedItem.disabled) return

      if (selectedId === selectedItem.id) {
        // 允许取消选中
        tryChangeSelectedId(null, null)
      } else {
        tryChangeSelectedId(selectedItem.id, selectedItem)
      }
    },
    [disabled, selectedId, tryChangeSelectedId]
  )

  return [selectedId, onSelect] as const
}
