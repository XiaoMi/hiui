import React from 'react'
import type { Row } from '@tanstack/table-core'
import { cls } from '../../utils/cls'
import { useEditableSchemaTableCtx } from '../../ctx'
import { useTableContainer } from '../../container'
import { ROW_OPERATION_COL_WIDTH } from '../../const'
import { OperationBodyCell } from './cell'

function OperationTable(props: React.PropsWithChildren<unknown>) {
  const { propsRef } = useEditableSchemaTableCtx()
  const width = propsRef.current.rowOperation?.width || ROW_OPERATION_COL_WIDTH

  return (
    <table
      // table
      className={cls('mock-operation')}
      data-is-operation
      style={{ width, flexBasis: width }}
    >
      <colgroup>
        <col style={{ width, minWidth: width }} />
      </colgroup>
      {props.children}
    </table>
  )
}

export function OperationHeader() {
  const { propsRef } = useEditableSchemaTableCtx()
  const cellText = propsRef.current.rowOperation?.headerText ?? '操作'

  return (
    <OperationTable>
      <thead className={cls('header')}>
        <tr className={cls('header-row')}>
          <th className={cls('header-cell')} data-text-align="center">
            {cellText}
          </th>
        </tr>
      </thead>
    </OperationTable>
  )
}

export function OperationBody() {
  const { table } = useEditableSchemaTableCtx()
  const { virtualize } = useTableContainer()
  const { rows: realRows } = table.getRowModel()

  return (
    <OperationTable>
      <tbody className={cls('body')}>
        {/* 行虚拟化上padding */}
        {(virtualize?.rowPadding?.top ?? 0) > 0 && (
          <tr className={cls('body-row', 'virtual-spacer', 'virtual-spacer-top')}>
            <td style={{ height: virtualize?.rowPadding?.top ?? 0 }} />
          </tr>
        )}

        {/* 渲染实际的行 */}
        {(virtualize?.rows || realRows).map((rowOrVirtual) => {
          const row: Row<AnyObject> =
            'index' in rowOrVirtual ? realRows[rowOrVirtual.index] : rowOrVirtual

          if (!row) return null
          return (
            <tr key={row.id} className={cls('body-row')} data-index={row.index} data-id={row.id}>
              <td className={cls('body-cell')} data-text-align="center">
                <OperationBodyCell row={row} />
              </td>
            </tr>
          )
        })}

        {/* 行虚拟化下padding */}
        {(virtualize?.rowPadding?.bottom ?? 0) > 0 && (
          <tr className={cls('body-row', 'virtual-spacer', 'virtual-spacer-bottom')}>
            <td style={{ height: virtualize?.rowPadding?.bottom ?? 0 }} />
          </tr>
        )}
      </tbody>
    </OperationTable>
  )
}

// 暂时用不上，预留位置待扩展
export function OperationFooter() {
  return (
    <OperationTable>
      <tfoot className={cls('footer')}>
        <tr className={cls('footer-row')}>
          <td className={cls('footer-cell')} data-text-align="center"></td>
        </tr>
      </tfoot>
    </OperationTable>
  )
}
