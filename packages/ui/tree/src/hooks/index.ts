import { useCallback } from 'react'
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
