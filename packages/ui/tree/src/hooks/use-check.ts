import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedTreeNodeData, TreeNodeEventData, TreeNodeData } from '../types'
import { processCheckedIds } from '../utils'
import { useCascadeCheck } from '@hi-ui/use-check'

/**
 * 用于 tree 组件复选的 hook
 */
export const useCheck = (
  checkedMode: string,
  disabled: boolean,
  flattedData: FlattedTreeNodeData[],
  defaultCheckedIds: React.ReactText[],
  checkedIdsProp?: React.ReactText[],
  onCheck?: (
    checkedIds: React.ReactText[],
    options: {
      checkedNodes: TreeNodeData[]
      semiCheckedIds: React.ReactText[]
      targetNode: TreeNodeEventData
      checked: boolean
    }
  ) => void
) => {
  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    (checkedIds, checkedNode, checked, semiCheckedIds) => {
      const processedIds = processCheckedIds(checkedMode, checkedIds, flattedData)

      const nextCheckedNodes = flattedData
        .filter((item) => processedIds.includes(item.id))
        .map((item) => item.raw)

      onCheck?.(processedIds, {
        checkedNodes: nextCheckedNodes,
        targetNode: checkedNode,
        semiCheckedIds,
        checked,
      })
    }
  )

  const cascaded = checkedMode !== 'SEPARATE'

  return useCascadeCheck({
    cascaded,
    disabled,
    flattedData,
    checkedIds,
    onCheck: trySetCheckedIds,
    allowCheck,
  })
}

const allowCheck = (targetItem: TreeNodeEventData) => {
  if (targetItem.disabled) {
    return false
  }
  return true
}
