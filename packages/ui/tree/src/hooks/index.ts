import { useCallback, useState, useEffect } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

export const useExpand = (defaultExpandedIds, expandedIds, onExpand) => {
  const [_expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    defaultExpandedIds,
    expandedIds,
    onExpand
  )

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      if (expandedNode !== undefined) {
        tryToggleExpandedIds(
          // 单选逻辑 数组增减元素
          isExpanded
            ? _expandedIds.concat(expandedNode.id)
            : _expandedIds.filter((id) => id !== expandedNode.id)
        )
      }
    },
    [_expandedIds, tryToggleExpandedIds]
  )

  return [_expandedIds, onExpandNode]
}

export const useSingleSelect = (
  defaultSelectedId?: string,
  selectedId?: string,
  onSelect?: (node: any) => void,
  disabled = false
) => {
  const proxyOnSelect = useCallback(
    (_: string | undefined, node: any) => {
      onSelect?.(node)
    },
    [onSelect]
  )

  const [_selectedId, tryChangeSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedId,
    // import is `id` but export `rawData`
    proxyOnSelect
  )

  const onNodeSelect = useCallback(
    (selectedNode) => {
      if (disabled) return

      tryChangeSelectedId(selectedNode.id, selectedNode)
    },
    [disabled, tryChangeSelectedId]
  )

  return [_selectedId, onNodeSelect] as const
}
