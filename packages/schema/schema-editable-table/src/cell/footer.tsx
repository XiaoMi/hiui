import React from 'react'
import { get } from 'lodash-es'
import type { HeaderContext } from '@tanstack/react-table'

import { useSubscribe, useSubscribeList, NOOP_SUBSCRIPTION } from '@hi-ui/use-subscription'
import { NumberUtil } from '@hi-ui/schema-utils'

import { useEditableSchemaTableCtx } from '../ctx'

export type FooterCellProps<TData extends AnyObject = AnyObject> = Pick<
  HeaderContext<TData, unknown>,
  'column' | 'table'
>

export default React.memo(
  function FooterCell<TData extends AnyObject>(props: FooterCellProps<TData>) {
    const field = props.column.columnDef.meta?.field

    const { table, subscription, globalStaticRef, ...restCtx } = useEditableSchemaTableCtx()

    const invalidField = !field
    const isNotNumber = field?.valueType !== 'number'

    const isNotAvailable = invalidField || isNotNumber

    // 用于在任意字段变更时触发重渲染，因此不关心返回结果
    useSubscribeList(subscription, undefined, {
      // field 不存在或者字段类型不是 number 时，不创建订阅
      skipSubscribe: isNotAvailable,
    })

    // 有效字段，且开启了筛选，则订阅筛选状态
    // 不关心实际的筛选结果，仅用来触发更新
    const filterState =
      globalStaticRef.current.enableFilter && !isNotAvailable
        ? restCtx.filterState
        : NOOP_SUBSCRIPTION
    useSubscribe(filterState, undefined)

    // 首列固定展示 // TODO 待支持动态首列配置
    const colIndex = props.column.getIndex()
    const _enableRowSelection = globalStaticRef.current.enableRowSelection
    if (colIndex === 0 && !_enableRowSelection) return <>合计</>

    if (isNotAvailable) return null

    const tableData = subscription.getValue()
    const filteredRows = table.getFilteredRowModel().flatRows
    const fieldData = filteredRows.map((row) => get(tableData, [row.index, field.dataIndex]))

    return (
      <>
        {NumberUtil.chain(0)
          .add(...fieldData)
          .format(2)}
      </>
    )
  }
  // propsAreEqual暂时置空
) as <TData extends AnyObject>(props: FooterCellProps<TData>) => React.ReactElement
