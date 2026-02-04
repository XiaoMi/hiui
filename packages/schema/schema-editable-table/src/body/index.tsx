import React from 'react'
import { useMount } from 'ahooks'
import type { Cell, Row } from '@tanstack/react-table'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useEditableSchemaTableCtx } from '../ctx'
import { useTableContainer } from '../container/index'
import { cls } from '../utils/cls'
import { BodyCellWrapper } from './wrapper'

type CellOrVirtualItem<TData> = Cell<TData, unknown> | VirtualItem
type RowOrVirtualItem<TData> = Row<TData> | VirtualItem

type GetRowStyleCtxType<TData> = {
  row: Row<TData>
}

export type EditTableBodyProps<TData> = {
  className?: string
  getRowStyle?: (row: TData, ctx: GetRowStyleCtxType<TData>) => React.CSSProperties
}

type BodyRowProps<TData> = {
  row: Row<TData>
  getRowStyle?: EditTableBodyProps<TData>['getRowStyle']
}

export type OnBodyRowMountedFn<TData> = (ctx: { row: Row<TData> }) => void

const BodyRow = React.memo(function BodyRow<TData extends AnyObject>(props: BodyRowProps<TData>) {
  const { row } = props
  const { virtualize } = useTableContainer()
  const { propsRef } = useEditableSchemaTableCtx<TData>()

  const realCells = row.getVisibleCells()
  const rowStyle = props.getRowStyle?.(row.original as TData, { row })

  const leftCells = row.getLeftVisibleCells()
  const rightCells = row.getRightVisibleCells()
  const centerCells = row.getCenterVisibleCells()

  useMount(() => {
    propsRef.current?.on?.rowMounted?.({ row })
  })

  return (
    <tr
      // tr
      key={row.id}
      style={rowStyle}
      className={cls('body-row')}
      data-index={row.index}
      data-id={row.id}
    >
      {/* 左侧固定列 */}
      {leftCells.map((cell) => {
        return <BodyCellWrapper key={cell.id} cell={cell} fixed />
      })}

      {/* 列虚拟化左侧padding */}
      {(virtualize?.colPadding?.left ?? 0) > 0 && <td />}

      {/* 渲染实际的单元格 */}
      {(virtualize?.columns || centerCells).map((cellOrVirtual: CellOrVirtualItem<TData>) => {
        const cell: typeof realCells[0] =
          'index' in cellOrVirtual ? realCells[cellOrVirtual.index] : cellOrVirtual

        // 固定列不参与中间部分渲染
        if (cell.column.getIsPinned()) return null

        return <BodyCellWrapper key={cell.id} cell={cell} />
      })}

      {/* 列虚拟化右侧padding */}
      {(virtualize?.colPadding?.right ?? 0) > 0 && <td />}

      {/* 右侧固定列 */}
      {rightCells.map((cell) => {
        return <BodyCellWrapper key={cell.id} cell={cell} fixed />
      })}
    </tr>
  )
})

export default React.memo(function Body<TData extends AnyObject>(props: EditTableBodyProps<TData>) {
  const { table } = useEditableSchemaTableCtx<TData>()
  const { virtualize } = useTableContainer()

  const { rows: realRows } = table.getRowModel()

  return (
    <tbody className={cls('body', props.className)}>
      {/* 行虚拟化上padding */}
      {(virtualize?.rowPadding?.top ?? 0) > 0 && (
        <tr className={cls('body-row', 'virtual-spacer', 'virtual-spacer-top')}>
          <td style={{ height: virtualize?.rowPadding?.top ?? 0 }} />
        </tr>
      )}

      {/* 渲染实际的行 */}
      {(virtualize?.rows || realRows).map((rowOrVirtual: RowOrVirtualItem<TData>) => {
        const row = 'id' in rowOrVirtual ? rowOrVirtual : realRows[rowOrVirtual.index]

        if (!row) return null
        return (
          <BodyRow
            key={row.id}
            row={row as Row<AnyObject>}
            getRowStyle={props.getRowStyle as BodyRowProps<AnyObject>['getRowStyle']}
          />
        )
      })}

      {/* 行虚拟化下padding */}
      {(virtualize?.rowPadding?.bottom ?? 0) > 0 && (
        <tr className={cls('body-row', 'virtual-spacer', 'virtual-spacer-bottom')}>
          <td style={{ height: virtualize?.rowPadding?.bottom ?? 0 }} />
        </tr>
      )}
    </tbody>
  )
}) as <TData>(props: EditTableBodyProps<TData>) => React.ReactElement
