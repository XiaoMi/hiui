import React from 'react'
import { FlattedTableColumnItemData, TableColumnItem } from '../types'
import {
  cloneTree,
  flattenTree,
  getLeafChildren,
  groupByTreeDepth,
  isLeaf,
} from '@hi-ui/tree-utils'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

export const useColFrozen = ({
  columns,
  resizable,
}: {
  resizable: boolean
  columns: TableColumnItem[]
}) => {
  // 拉平后的数据
  const [flattedColumns, maxColumnDepth] = React.useMemo(() => {
    const clonedColumns = cloneTree(columns)
    let maxDepth = 0

    // TODO: flattenTree 支持不带 id 的
    // TODO: 支持多级表头
    // @ts-ignore
    const flattedColumns = flattenTree(clonedColumns, (node) => {
      if (node.depth > maxDepth) {
        maxDepth = node.depth
      }
      return {
        ...node,
        // @ts-ignore
        width: node.raw.width,
        // @ts-ignore
        id: node.raw.dataKey,
        // @ts-ignore
        dataKey: node.raw.dataKey,
        // @ts-ignore
        title: node.raw.title,
      }
    })

    return [flattedColumns, maxDepth] as const
  }, [columns])

  // 末级 column
  const flattedColumnsWithoutChildren = React.useMemo(() => {
    return flattedColumns.filter((col) => !isArrayNonEmpty(col.children))
  }, [flattedColumns])

  const [mergedColumns, groupedColumns] = React.useMemo(() => {
    const nextColumns: FlattedTableColumnItemData[] = [].concat(
      // @ts-ignore
      flattedColumns.filter((col) => isLeaf(col)) as FlattedTableColumnItemData[]
    )

    // 表头分组
    // 在最后一层，colSpan = 1, rowSpan = maxDepth - depth + 1
    // 不在最后一层，rowSpan = 1, colSpan = 叶子节点后代数量
    flattedColumns.forEach((column: any) => {
      if (isLeaf(column)) {
        column.rowSpan = maxColumnDepth - column.depth + 1
        column.colSpan = 1
      } else {
        column.rowSpan = 1
        column.colSpan = getLeafChildren(column)
      }
    })

    const groupedColumns = groupByTreeDepth(columns)
    return [nextColumns, groupedColumns] as const
  }, [columns, flattedColumns, maxColumnDepth])

  return {
    // getColgroupProps,
    flattedColumns,
    mergedColumns,
    groupedColumns,
    flattedColumnsWithoutChildren,
  }
}
