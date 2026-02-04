import type { Row, RowData } from '@tanstack/table-core'
import { isNil } from 'lodash-es'

/**
 * 检查值是否为空值（包括null、undefined、'null'、'undefined'和空字符串）
 */
export function isEmptyValue(value: unknown): boolean {
  if (isNil(value)) return true
  if (value === 'null' || value === 'undefined' || value === '') return true
  return false
}

// 参考了内置的 flattenBy 方法
// https://github.com/TanStack/table/blob/66fbe3a74b129e700e4667d1d5e1b29dd0a7b723/packages/table-core/src/utils.ts#L115-L134
export function getGroupedLeafRows<TData extends RowData>(rows: Row<TData>[]) {
  const flat: Row<TData>[] = []

  const recurse = (subRows: Row<TData>[]) => {
    subRows.forEach((row) => {
      if (!row.getIsGrouped()) flat.push(row)

      const children = row.subRows
      if (children?.length) {
        recurse(children)
      }
    })
  }

  recurse(rows)

  return flat
}
