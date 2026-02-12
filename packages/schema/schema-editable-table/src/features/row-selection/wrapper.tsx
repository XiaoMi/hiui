import React from 'react'
import type { Row } from '@tanstack/table-core'
import type { VirtualItem } from '@tanstack/react-virtual'
import { cls } from '../../utils/cls'
import { useEditableSchemaTableCtx } from '../../ctx'
import { useTableContainer } from '../../container'
import { useSyncHoverStyle } from './hooks/use-sync-hover-style'
import { useClickSelect } from './hooks/use-click-select'
import { SelectionHeaderCell, SelectionBodyCell } from './index'

type RowOrVirtualItem = Row<AnyObject> | VirtualItem

function SelectionTable(props: React.PropsWithChildren<unknown>) {
  const width = 50
  return (
    <table className={cls('mock-selection')} data-is-selection>
      <colgroup>
        <col style={{ width, minWidth: width }} />
      </colgroup>
      {props.children}
    </table>
  )
}

function SelectionHeader() {
  return (
    <SelectionTable>
      <thead className={cls('header')} style={{ height: '100%' }}>
        <tr className={cls('header-row')}>
          <th className={cls('header-cell')} data-text-align="center">
            <SelectionHeaderCell />
          </th>
        </tr>
      </thead>
    </SelectionTable>
  )
}

function SelectionBody() {
  const { table } = useEditableSchemaTableCtx()
  const { virtualize } = useTableContainer()
  const { rows: realRows } = table.getRowModel()

  // 同步表格行的 hover 状态
  useSyncHoverStyle()
  // 点击行选择 // 内部有开关决定是否启用
  useClickSelect()

  return (
    <SelectionTable>
      <tbody className={cls('body')}>
        {/* 行虚拟化上padding */}
        {(virtualize?.rowPadding?.top ?? 0) > 0 && (
          <tr className={cls('body-row', 'virtual-spacer', 'virtual-spacer-top')}>
            <td style={{ height: virtualize?.rowPadding?.top ?? 0 }} />
          </tr>
        )}

        {/* 渲染实际的行 */}
        {(virtualize?.rows || realRows).map((rowOrVirtual: RowOrVirtualItem) => {
          const row = 'id' in rowOrVirtual ? rowOrVirtual : realRows[rowOrVirtual.index]

          if (!row) return null
          return (
            <tr key={row.id} className={cls('body-row')} data-index={row.index} data-id={row.id}>
              <td className={cls('body-cell')} data-text-align="center">
                <SelectionBodyCell row={row} />
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
    </SelectionTable>
  )
}

// 暂时用不上，预留位置待扩展
function SelectionFooter() {
  return (
    <SelectionTable>
      <tfoot className={cls('footer')}>
        <tr className={cls('footer-row')}>
          <td className={cls('footer-cell')} data-text-align="center"></td>
        </tr>
      </tfoot>
    </SelectionTable>
  )
}

export const RowSelection = {
  Header: SelectionHeader,
  Body: SelectionBody,
  Footer: SelectionFooter,
}
