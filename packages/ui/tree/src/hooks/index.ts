import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

export const useExpand = (
  defaultExpandedIds: React.ReactText[],
  expandedIds?: React.ReactText[],
  onExpand?: (node: any) => void
) => {
  const [_expandedIds, tryToggleExpandedIds] = useUncontrolledState(
    defaultExpandedIds,
    expandedIds,
    onExpand
  )

  const expandedNodeIdsMp = useMemo(() => new Set<React.ReactText>(), [])

  const onExpandNode = useCallback(
    (expandedNode, isExpanded) => {
      // TODO：多选逻辑抽离复用
      if (isExpanded) {
        expandedNodeIdsMp.add(expandedNode.id)
      } else {
        expandedNodeIdsMp.delete(expandedNode.id)
      }

      tryToggleExpandedIds(Array.from(expandedNodeIdsMp))
    },
    [expandedNodeIdsMp, tryToggleExpandedIds]
  )

  return [_expandedIds, onExpandNode, expandedNodeIdsMp] as const
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
