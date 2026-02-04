import type { TableFeature } from '@tanstack/react-table'
import { getGroupedLeafRows } from '../../utils/grouping'

export const CustomAggregatedFeature: TableFeature<AnyType> = {
  createRow(row, table) {
    // 参考代码来源
    // https://github.com/TanStack/table/blob/66fbe3a74b129e700e4667d1d5e1b29dd0a7b723/packages/table-core/src/utils/getGroupedRowModel.ts#L94-L127
    row.$getAggregatedValue = function getRowAggregateValue(columnId) {
      const column = table.getColumn(columnId)

      // 有缓存直接去取
      if (columnId in row._groupingValuesCache) {
        return row._groupingValuesCache[columnId]
      }

      const aggregateFn = column?.getAggregationFn()
      if (aggregateFn) {
        const groupedRows = row.subRows
        // 原版使用 flattenBy 方法生成叶节点，会将中间的节点也包含进去，不符合 IPDTable 的分组逻辑
        // 因此此处使用 getGroupedLeafRows 方法，生成结果仅包含叶节点
        // const leafRows = flattenBy(groupedRows, (row) => row.subRows)
        const leafRows = getGroupedLeafRows(groupedRows)

        row._groupingValuesCache[columnId] = aggregateFn(columnId, leafRows, groupedRows)
        return row._groupingValuesCache[columnId]
      }
    }
  },
  createCell(cell, column, row) {
    cell.$getAggregatedValue = function getCellAggregatedValue() {
      return row.$getAggregatedValue(column.id)
    }
  },
}
