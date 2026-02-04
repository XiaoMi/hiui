import { createCell } from '@tanstack/react-table'
import type { TableFeature } from '@tanstack/react-table'

export const CustomGetterFeature: TableFeature<AnyType> = {
  createTable(table) {
    table.$getInnerRef = function $getInnerRef() {
      // @ts-expect-error innerRef
      return table.options.meta?.innerRef as NonNullable<typeof table.options.meta.innerRef>
    }

    table.$getCell = function $getCell(cellId) {
      const firstUnderscoreIndex = cellId.indexOf('_')
      const rowId = cellId.slice(0, firstUnderscoreIndex)
      const columnId = cellId.slice(firstUnderscoreIndex + 1)

      const row = table.getRow(rowId)
      if (!row) return null

      const column = table.getColumn(columnId)
      if (!column) return null

      return createCell(table, row, column, columnId)
    }

    table.$getRealtimeRowData = function getTableRealtimeRowData(rowId) {
      try {
        const row = table.getRow(rowId)
        if (!row) return undefined

        const subscription = table.options.meta?.subscription
        if (!subscription) return undefined

        const rowIndex = row.index
        return subscription.getValue()[rowIndex]
      } catch (error) {
        return undefined
      }
    }
  },
  createRow(row, table) {
    row.$getRealtimeRowData = function getRealtimeRowData() {
      // 这里的 row.original 实际上没用
      // getRealtimeRowData 会返回 undefined 是因为 rowId 可能会被用户误传
      // 但此处的 rowId 是不会错误的，所以只是留一个 fallback
      return table.$getRealtimeRowData(row.id) || row.original
    }
  },
  createCell(cell, column, row) {
    cell.$getRealtimeRowData = function getRealtimeCellRowData() {
      return row.$getRealtimeRowData()
    }
  },
}
