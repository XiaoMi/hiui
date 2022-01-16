import React, { useEffect } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTableContext } from './context'
import Loading from '@hi-ui/loading'
import { TableColumnItem, FlattedTableRowData } from './types'

const _prefix = getPrefixCls('table-embed-row')

/**
 *  可展开的内嵌面板
 */
export const TableEmbedRow = ({
  prefixCls = _prefix,
  columns,
  rowIndex,
  rowData,
}: TableEmbedRowProps) => {
  const {
    isExpandEmbedRows,
    getEmbedPanelById,
    isEmbedLoadingId,
    onEmbedSwitch,
  } = useTableContext()

  const loading = isEmbedLoadingId(rowData.id)
  const expanded = isExpandEmbedRows(rowData.id)

  useEffect(() => {
    if (expanded) {
      onEmbedSwitch(rowData, rowIndex)
    }
  }, [onEmbedSwitch, expanded, rowData, rowIndex])

  return expanded ? (
    <tr key="expanded-row" className={prefixCls}>
      <td colSpan={columns.length}>
        {/* 乐观渲染：内嵌面板内容 */}
        <Loading size="sm" visible={loading}>
          {getEmbedPanelById(rowData.id)}
        </Loading>
      </td>
    </tr>
  ) : null
}

export interface TableEmbedRowProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: TableColumnItem[]
  /**
   * 操作展开行的行数据
   */
  rowData: FlattedTableRowData
  /**
   * 操作展开行的行下标
   */
  rowIndex: number
}

if (__DEV__) {
  TableEmbedRow.displayName = 'TableEmbedRow'
}
