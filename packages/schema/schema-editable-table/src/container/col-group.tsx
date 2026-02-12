import React from 'react'
import type { VirtualItem } from '@tanstack/react-virtual'
import type { Column } from '@tanstack/react-table'

import { useEditableSchemaTableCtx } from '../ctx'
import { isSystemCol } from '../const'
import { groupHeaders } from '../header'

// 基础 ColGroup
export function TableColGroup() {
  const { table } = useEditableSchemaTableCtx()

  return (
    <colgroup>
      {table.getVisibleLeafColumns().map((column) => {
        return <Col key={column.id} column={column} />
      })}
    </colgroup>
  )
}

type VirtualColGroupProps = {
  virtualColumns: VirtualItem[]
  virtualColPadding: {
    start: number
    end: number
  }
}

// 虚拟化 ColGroup
export function VirtualColGroup({ virtualColumns, virtualColPadding }: VirtualColGroupProps) {
  const { table } = useEditableSchemaTableCtx()

  const headerGroups = table.getHeaderGroups()
  const lastHeaderGroup = headerGroups[headerGroups.length - 1]

  const realHeaders = lastHeaderGroup.headers
  const {
    left: leftHeaders,
    right: rightHeaders,
    // center: centerHeaders,
  } = groupHeaders(realHeaders, table)

  return (
    <colgroup>
      {/* 左侧固定列 */}
      {leftHeaders.map(({ column }) => (
        <Col key={column.id} column={column} />
      ))}

      {/* 中间可滚动区域(虚拟化) */}
      {virtualColPadding.start > 0 && <col style={{ width: virtualColPadding.start }} />}
      {virtualColumns.map((vc) => {
        const column = realHeaders[vc.index].column

        // 固定列不参与中间部分渲染
        if (column.getIsPinned()) return null

        return <Col key={column.id} column={column} />
      })}
      {virtualColPadding.end > 0 && <col style={{ width: virtualColPadding.end }} />}

      {/* 右侧固定列 */}
      {rightHeaders.map(({ column }) => (
        <Col key={column.id} column={column} />
      ))}
    </colgroup>
  )
}

type ColProps = {
  column: Column<AnyType>
}

function Col(props: ColProps) {
  const { column } = props
  const colWidth = column.getSize()
  // 系统字段列使用固定宽度，其他列使用最小宽度+自动列宽
  // 自动列宽分配是指：表格宽度超过所有列宽之和时，自动分配剩余宽度
  // NOTE 预期如上述描述所示，但实测这样写系统字段还是会参与自动列宽分配
  const maxWidth = isSystemCol(column.id) ? colWidth : undefined

  return (
    <col
      key={column.id}
      data-id={column.id}
      style={{ width: colWidth, minWidth: colWidth, maxWidth }}
    />
  )
}
