import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TreeNodeData } from '../TreeNode'

/**
 * 一个用于 tree 组件选择的 hook
 *
 * @param defaultSelectedId 非受控默认选中的 id，默认为 `null`，唯一表示不选中任何实体
 * @param selectedIdProp
 * @param onSelectProp
 * @param disabled
 * @returns
 */
export const useSelect = (
  defaultSelectedId: React.ReactText | null = null,
  selectedIdProp?: React.ReactText | null,
  onSelectProp?: (selectedId: React.ReactText | null, item: TreeNodeData | null) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (id: React.ReactText | null, item: TreeNodeData | null) => {
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
    (selectedItem: TreeNodeData) => {
      if (disabled) return

      if (selectedId === selectedItem.id) {
        // 允许取消选中
        tryChangeSelectedId(null, null)
        return
      }

      tryChangeSelectedId(selectedItem.id, selectedItem)
    },
    [disabled, selectedId, tryChangeSelectedId]
  )

  return [selectedId, onSelect] as const
}
