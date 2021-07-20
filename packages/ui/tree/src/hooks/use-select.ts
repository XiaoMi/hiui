import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TreeNodeData } from '../TreeNode'

export const useSelect = (
  // 使用 `null` 来唯一表示不选中任何实体
  defaultSelectedId: React.ReactText | null = null,
  selectedId?: React.ReactText | null,
  onSelect?: (selectedId: React.ReactText | null, item: TreeNodeData | null) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (id: React.ReactText | null, item: TreeNodeData | null) => {
      onSelect?.(id, item)
    },
    [onSelect]
  )

  const [_selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedId,
    proxyOnSelect
  )

  const _onSelect = useCallback(
    (selectedItem: TreeNodeData) => {
      if (disabled) return

      if (_selectedId === selectedItem.id) {
        // 取消选中
        tryChangeSelectedId(null, null)
      } else {
        tryChangeSelectedId(selectedItem.id, selectedItem)
      }
    },
    [disabled, _selectedId, tryChangeSelectedId]
  )

  return [_selectedId, _onSelect] as const
}
