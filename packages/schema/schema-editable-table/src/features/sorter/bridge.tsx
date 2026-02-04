import React, { useEffect } from 'react'
import type { HeaderContext } from '@tanstack/react-table'
import { TableSorter } from '@hi-ui/table-extensions'
import { useSubscribe } from '@hi-ui/use-subscription'
import { mergeProps, getBoolConfig } from '@hi-ui/schema-utils'
import type { FieldConfigType, FieldSorterConfigType } from '@hi-ui/schema-core'
import type { SortDirection } from '@hi-ui/table-extensions'
import { useEditTableCtx } from '../../ctx'

export type TableSorterBridgeProps<TData extends AnyObject> = {
  column: HeaderContext<TData, unknown>['column']
  field: FieldConfigType
  sorter?: FieldSorterConfigType
}

export function TableSorterBridge<TData extends AnyObject>(props: TableSorterBridgeProps<TData>) {
  const { column, sorter: sorterConfig } = props
  const { sorterState, propsRef } = useEditTableCtx()

  const [direction, setDirection] = React.useState<SortDirection>(null)

  // 列的排序状态会受到全局排序状态的影响
  // 全局变更时，主动触发一次自身的重渲染
  useSubscribe(sorterState)

  // 外部主动设置时自动更新至内部
  const sorterValue = column.getIsSorted()
  useEffect(() => {
    setDirection(sorterValue || null)
  }, [sorterValue])

  const handleChange = (direction: SortDirection) => {
    setDirection(direction)

    // 取消排序时，需要主动清除排序状态
    if (direction === null) {
      column.clearSorting()
      return
    }

    const isDesc = direction === 'desc'
    // toggleSorting 需要手动传入是否降序，是否可多排序
    column.toggleSorting(isDesc, column.getCanMultiSort())
  }

  const fieldTooltipConfig = getBoolConfig(sorterConfig?.tooltip, {})
  const propsTooltipConfig = propsRef.current.sorter?.tooltip
  const tooltip =
    fieldTooltipConfig || propsTooltipConfig
      ? mergeProps(propsTooltipConfig, fieldTooltipConfig)
      : undefined

  return (
    <TableSorter
      direction={direction}
      onChange={handleChange}
      tooltip={tooltip}
      // disabled // 暂时好像没有加的必要，留注释等待后续更新
    />
  )
}
