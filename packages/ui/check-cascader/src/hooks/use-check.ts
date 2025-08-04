import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCascadeCheck } from '@hi-ui/use-check'
import { CheckCascaderItemEventData, FlattedCheckCascaderDataItem } from '../types'
import { parseCheckDataDirty, processCheckedIds, allowCheck } from '../utils'

const NOOP_ARRAY = [] as []

export const useCheck = (
  checkedMode: string,
  disabled: boolean,
  flattedData: FlattedCheckCascaderDataItem[],
  defaultCheckedIds: React.ReactText[] = NOOP_ARRAY,
  checkedIdsProp?: React.ReactText[],
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: CheckCascaderItemEventData,
    checked: boolean
  ) => void
) => {
  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    (checkedIds, checkedNode, shouldChecked, semiCheckedIds) => {
      // 出口数据处理
      onCheck?.({ checkedIds, semiCheckedIds }, checkedNode, shouldChecked)
    }
  )

  // 入口数据处理
  const parsedCheckedIds = parseCheckDataDirty(checkedMode, checkedIds, flattedData, allowCheck)
  // 合并 checkedIds，防止部分模式(PARENT和CHILD)在搜索场景下 id 丢失 (https://github.com/XiaoMi/hiui/issues/2750)
  const mergedCheckedIds = Array.from(new Set([...parsedCheckedIds, ...checkedIds]))

  const cascaded = checkedMode !== 'SEPARATE'

  return useCascadeCheck({
    cascaded,
    disabled,
    flattedData,
    checkedIds: mergedCheckedIds,
    onCheck: (checkedIds, checkedNode, shouldChecked, semiCheckedIds) => {
      // 出口数据处理
      const processedIds = processCheckedIds(checkedMode, checkedIds, flattedData, allowCheck)

      trySetCheckedIds(processedIds, checkedNode, shouldChecked, semiCheckedIds)
    },
    allowCheck,
  })
}
