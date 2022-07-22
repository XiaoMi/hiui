import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef } from '@hi-ui/use-latest'
import { TreeNodeEventData } from '../types'

/**
 * 用于 tree 组件选中的 hook
 *
 * @param defaultSelectedId 非受控默认选中的 id，其值默认为 `null`，表示不选中任何实体
 * @param selectedIdProp
 * @param onSelectProp
 * @param disabled
 * @returns
 */
export const useSelect = (
  disabled: boolean,
  defaultSelectedId: React.ReactText | null = null,
  selectedIdProp?: React.ReactText | null,
  onSelectProp?: (
    selectedId: React.ReactText | null,
    selectedNode: TreeNodeEventData | null
  ) => void
) => {
  const onSelectRef = useLatestRef(onSelectProp)
  const proxyOnSelect = useCallback(
    (id: React.ReactText | null, item: TreeNodeEventData | null) => {
      onSelectRef.current?.(id, item)
    },
    []
  )

  const [selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedIdProp,
    proxyOnSelect
  )

  const onSelect = useCallback(
    (selectedNode: TreeNodeEventData) => {
      if (disabled || selectedNode.disabled) return

      if (selectedId === selectedNode.id) {
        // 允许取消选中
        tryChangeSelectedId(null, null)
      } else {
        tryChangeSelectedId(selectedNode.id, selectedNode)
      }
    },
    [disabled, selectedId, tryChangeSelectedId]
  )

  return [selectedId, onSelect] as const
}
