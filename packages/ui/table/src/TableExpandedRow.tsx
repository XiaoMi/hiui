import React, { forwardRef, useEffect } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTableContext } from './context'
import Loading from '@hi-ui/loading'
import { TableColumnItem, TableRowSelection } from './types'
import { useLatestRef } from '@hi-ui/use-latest'

const _prefix = getPrefixCls('table-expanded-row')

/**
 * TODO: What is TableExpandedRow
 */
export const TableExpandedRow = forwardRef<HTMLDivElement | null, TableExpandedRowProps>(
  ({ prefixCls = _prefix, rowSelection, columns, rowData, rowIndex, expandedRender }, ref) => {
    // @ts-ignore
    const { isExpandEmbedRows } = useTableContext()

    const [expandedRow, setExpandedRow] = React.useState(null)
    const [loading, setLoading] = React.useState(false)

    const rowDataLatestRef = useLatestRef(rowData)
    // @ts-ignore
    const expanded = isExpandEmbedRows(rowData.id)

    useEffect(() => {
      if (!expanded) return

      const rowData = rowDataLatestRef.current
      const embedContentMaybePromise = expandedRender(rowData, rowIndex)

      if (embedContentMaybePromise.toString() === '[object Promise]') {
        setLoading(true)
        embedContentMaybePromise
          .then((jsxElement: any) => {
            setLoading(false)
            setExpandedRow(jsxElement)
          })
          .catch((err: any) => {
            setLoading(false)

            setExpandedRow(err)
          })
      } else {
        // 同步 onChange 存在闭包问题，当前是有请求然后展开，无法受控
        // 对于这个功能，需要使用 defaultExpandAllEmbed
        requestAnimationFrame(() => {
          setExpandedRow(embedContentMaybePromise)
        })
      }
      // Exclude for `onExpandEmbedRowsChange`
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowIndex, expandedRender, rowDataLatestRef, expanded])

    // 可展开的内嵌面板
    return expanded ? (
      <tr key="expanded-row" className={`${prefixCls}--expanded`}>
        {/* 多选占位 */}
        {rowSelection ? <td /> : null}
        {/* 可展开内嵌显示 */}
        <td colSpan={columns.length}>
          {expandedRow}
          {loading ? <Loading size="sm" /> : null}
        </td>
      </tr>
    ) : null
  }
)

export interface TableExpandedRowProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: TableColumnItem[]
  /**
   * 数据配置项
   */
  data: object[]
  /**
   * 第一行ref
   */
  // firstRowRef: React.RefObject<HTMLTableExpandedRowElement>
  fixedColWidth: number[]
  rowSelection?: TableRowSelection
  rowData?: object
  rowIndex?: number
  expandedRender: any
}

if (__DEV__) {
  TableExpandedRow.displayName = 'TableExpandedRow'
}
