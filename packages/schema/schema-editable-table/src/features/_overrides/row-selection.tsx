import { Schedular } from '@hi-ui/schema-utils'
import type { TableFeature } from '@tanstack/react-table'

export const CustomRowSelectionFeature: TableFeature<AnyObject> = {
  createTable(table) {
    table.$rowSelectionCache = {
      selectedRows: [],
      selectedRowKeys: [],
      selectedRowEntries: [],
    }
    table.$selectedRowsCache = new Map()

    table.$getRowSelection = function $getRowSelection(state) {
      const newState = state || table.getState().rowSelection

      // 如果 state 为空，则说明不是在变更时调用的，直接返回缓存
      if (!state) return table.$rowSelectionCache

      const innerRef = table.$getInnerRef()
      const allRows = innerRef.current.subscription.getValue()
      const preserveSelectedRows = getEnablePreserveSelectedRows()

      const selectedRowKeys: string[] = []
      const selectedRows: AnyObject[] = []
      const selectedRowEntries: [string, AnyObject][] = []
      for (const [rowId, selected] of Object.entries(newState)) {
        if (!selected) continue // selected 应该不可能为 false，此处保留用作保险

        selectedRowKeys.push(rowId)
        try {
          const row = table.getRow(rowId)
          const rowData = allRows[row.index]
          selectedRows.push(rowData)
          selectedRowEntries.push([rowId, rowData])
        } catch (error) {
          // 走到这里，说明 getRow 执行失败了
          if (preserveSelectedRows) {
            const rowData = table.$selectedRowsCache.get(rowId)
            if (rowData) {
              selectedRows.push(rowData)
              selectedRowEntries.push([rowId, rowData])
            }
          }
        }
      }

      const selection = {
        selectedRows,
        selectedRowKeys,
        selectedRowEntries,
      }
      table.$rowSelectionCache = selection
      return selection
    }

    table.$updateSelectedRowsCache = function $updateSelectedRowsCache(entries) {
      const preserveSelectedRows = getEnablePreserveSelectedRows()

      // 仅在开启 preserveSelectedRows 时才更新缓存
      if (preserveSelectedRows) {
        for (const [rowId, rowData] of entries) {
          table.$selectedRowsCache.set(rowId, rowData)
        }

        // 清除已经取消选择的行的缓存记录
        const innerRef = table.$getInnerRef()
        const rowSelectionState = innerRef.current.rowSelectionState
        const stateValue = rowSelectionState.getValue()
        for (const rowId in stateValue) {
          if (stateValue[rowId] === false) {
            table.$selectedRowsCache.delete(rowId)
          }
        }
      }
    }

    function getEnablePreserveSelectedRows() {
      const innerRef = table.$getInnerRef()
      return innerRef.current.propsRef.current.rowSelection?.preserveSelectedRows
    }
  },
  createRow(row) {
    row.$afterToggleSelected = function afterToggleSelected() {
      const parentRows = row.getParentRows()
      // 父行不会很多，所以直接反序后遍历
      parentRows.toReversed().forEach((parentRow) => {
        // 使用微任务调度则是因为，状态的变更稍微有一点点延迟，会拿不到实时的状态
        Schedular.nextMicro(() => {
          const isParentSelected = parentRow.getIsAllSubRowsSelected()
          parentRow.toggleSelected(isParentSelected, { selectChildren: false })
        })
      })
    }
  },
}
