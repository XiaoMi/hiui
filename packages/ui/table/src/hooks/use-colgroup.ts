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

export const useColumns = ({ columns }: { columns: TableColumnItem[] }) => {
  // 拉平后的数据
  const [flattedColumns, maxColumnDepth] = React.useMemo(() => {
    const clonedColumns = cloneTree(columns)
    let maxDepth = 0

    // @ts-ignore
    const flattedColumns = flattenTree(clonedColumns, (node, rootIndex) => {
      if (node.depth > maxDepth) {
        maxDepth = node.depth
      }

      const raw = node.raw

      return {
        ...node,
        // @ts-ignore
        width: raw.width,
        // @ts-ignore
        id: raw.dataKey,
        // @ts-ignore
        dataKey: raw.dataKey,
        // @ts-ignore
        title: raw.title,
        // @ts-ignore
        align: raw.align ?? 'left',
        rootIndex,
      }
    })

    return [flattedColumns, maxDepth] as const
  }, [columns])

  // 末级 column
  const flattedColumnsWithoutChildren = React.useMemo(() => {
    return flattedColumns.filter((col) => !isArrayNonEmpty(col.children))
  }, [flattedColumns])

  const [mergedColumns, groupedColumns, leafColumns] = React.useMemo(() => {
    const preset: FlattedTableColumnItemData[] = []

    const nextColumns = preset.concat(
      // @ts-ignore
      // flattedColumns.filter((col) => isLeaf(col)) as FlattedTableColumnItemData[]
      flattedColumns
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
        column.colSpan = getLeafChildren(column).length
      }
    })

    const leafColumns = flattedColumns.filter((col) => isLeaf(col))
    const groupedColumns = groupByTreeDepth(nextColumns)

    return [nextColumns, groupedColumns, leafColumns] as const
  }, [flattedColumns, maxColumnDepth])

  return {
    // getColgroupProps,
    flattedColumns,
    mergedColumns,
    groupedColumns,
    leafColumns,
    flattedColumnsWithoutChildren,
  }
}
