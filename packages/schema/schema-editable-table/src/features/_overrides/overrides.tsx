import type { TableFeature } from '@tanstack/react-table'
import { DFT_PAGINATION_PAGE_SIZE } from '../../const'

// 内置 Feature 的覆写逻辑
export const OverridesFeature: TableFeature<AnyType> = {
  createTable(table) {
    // 覆写 resetPagination 方法
    if (!table.originalResetPagination) table.originalResetPagination = table.resetPagination
    table.resetPagination = function resetPagination(defaultState?: boolean) {
      // 先从分页状态中取行数，否则从 table 实例数据上取
      // 原因是后端分页时，table 实例上只有一页的数据，不准
      const rowCount = table.getState().pagination.rowCount ?? table.getRowCount()

      if (defaultState) {
        const pageSize = DFT_PAGINATION_PAGE_SIZE
        table.setPagination({ pageIndex: 0, pageSize, rowCount })
      } else {
        const { pagination } = table.initialState
        table.setPagination({ ...pagination, rowCount })
      }
    }
  },
}
