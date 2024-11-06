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
    const flattedColumns = flattenTree(clonedColumns, (node) => {
      if (node.depth > maxDepth) {
        maxDepth = node.depth
      }

      const raw = node.raw as any

      return {
        ...node,
        id: raw.dataKey,
        width: raw.width,
        // TODO: remove it
        dataKey: raw.dataKey,
        title: raw.title,
        align: raw.align ?? 'left',
        render: raw.render,
        colSpan: raw.colSpan,
      }
    })

    // 记录下标位置，方便冻结列操作计算时快速获取更新
    flattedColumns.forEach((column, index) => {
      // @ts-ignore
      column.index = index
    })

    return [flattedColumns, maxDepth] as const
  }, [columns])

  // 末级 column
  const flattedColumnsWithoutChildren = React.useMemo(() => {
    return flattedColumns.filter((col) => !isArrayNonEmpty(col.children))
  }, [flattedColumns])

  const [mergedColumns, groupedColumns, leafColumns] = React.useMemo(() => {
    const nextColumns: FlattedTableColumnItemData[] = [].concat(
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
        column.colSpan = column.colSpan ?? 1
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
