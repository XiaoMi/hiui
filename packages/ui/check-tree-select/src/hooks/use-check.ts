import React, { useCallback, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCascadeCheck } from '@hi-ui/use-check'
import {
  FlattedCheckTreeSelectDataItem,
  CheckTreeSelectItemEventData,
  CheckTreeSelectDataItem,
} from '../types'
import { parseCheckDataDirty, processCheckedIds } from '../utils'

/**
 * 用于 tree 组件复选的 hook
 */
export const useCheck = (
  checkedMode: string,
  disabled: boolean,
  flattedData: FlattedCheckTreeSelectDataItem[],
  defaultCheckedIds: React.ReactText[],
  checkedIdsProp?: React.ReactText[],
  onCheck?: (
    checkedIds: React.ReactText[],
    options: {
      checkedNodes: CheckTreeSelectDataItem[]
      semiCheckedIds: React.ReactText[]
      targetNode: CheckTreeSelectItemEventData
      checked: boolean
    }
  ) => void
) => {
  // 搜索时临时选中缓存数据
  const [checkedNodes, setCheckedNodes] = useState<FlattedCheckTreeSelectDataItem[]>([])

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    (checkedIds, checkedNode, checked, semiCheckedIds) => {
      const nextCheckedNodes = flattedData.filter((item) => checkedIds.includes(item.id))
      setCheckedNodes(nextCheckedNodes)

      onCheck?.(checkedIds, {
        checkedNodes: nextCheckedNodes.map((item) => item.raw),
        targetNode: checkedNode,
        semiCheckedIds,
        checked,
      })
    }
  )

  // 入口数据处理
  const parsedCheckedIds = useMemo(() => {
    return parseCheckDataDirty(checkedMode, checkedIds, flattedData, allowCheck)
  }, [checkedMode, checkedIds, flattedData])

  const cascaded = checkedMode !== 'SEPARATE'

  const [onNodeCheck] = useCascadeCheck({
    cascaded,
    disabled,
    flattedData,
    checkedIds: parsedCheckedIds,
    onCheck: (checkedIds, checkedNode, checked, semiCheckedIds) => {
      // 出口数据处理
      const processedIds = processCheckedIds(checkedMode, checkedIds, flattedData, allowCheck)
      trySetCheckedIds(processedIds, checkedNode, checked, semiCheckedIds)
    },
    allowCheck,
  })

  const proxyOnNodeCheck = useCallback(
    (target: FlattedCheckTreeSelectDataItem, shouldChecked: boolean) => {
      // 保证 target 来源于原数据自身，而不是tree内部
      const targetNode = flattedData.find((item) => item.id === target.id)
      if (targetNode) {
        onNodeCheck(targetNode, shouldChecked)
      }
    },
    [onNodeCheck, flattedData]
  )

  return [checkedIds, trySetCheckedIds, proxyOnNodeCheck, checkedNodes, parsedCheckedIds] as const
}

const allowCheck = (targetItem: CheckTreeSelectItemEventData) => {
  if (targetItem.disabled) {
    return false
  }
  return true
}
