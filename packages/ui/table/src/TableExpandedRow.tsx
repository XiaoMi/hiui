import React, { forwardRef, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Column, RowSelection } from './Table'
import { Checkbox } from '@hi-ui/checkbox'
import { useTableContext } from './context'
import { cloneTree } from '@hi-ui/tree-utils'
import { defaultLoadingIcon } from './icons/index'
import { IconButton } from '@hi-ui/icon-button'
import { TableCell } from './TableCell'
import Loading from '@hi-ui/loading'

const _prefix = getPrefixCls('table-expanded-row')

/**
 * TODO: What is TableExpandedRow
 */
export const TableExpandedRow = forwardRef<HTMLDivElement | null, TableExpandedRowProps>(
  (
    {
      prefixCls = _prefix,
      expandedRender,
      expanded,
      setExpanded,
      onExpand,
      rowSelection,
      columns,
      rowData,
      index,
    },
    ref
  ) => {
    const [expandedRow, setExpandedRow] = React.useState(null)

    useEffect(() => {
      const node = expandedRender(rowData, index)
      if (node.toString() === '[object Promise]') {
        setExpanded('loading')

        node
          .then((jsxElement) => {
            setExpandedRow(jsxElement)
            setExpanded(true)
          })
          .catch((err) => {
            setExpandedRow(err)
            setExpanded(true)
          })
      } else {
        setExpandedRow(node)
        setExpanded(true)
      }
    }, [rowData, index, expandedRender, setExpanded])

    if (!expanded) return null

    // 可展开的内嵌面板
    return (
      <tr
        key="expanded-row"
        className={`${prefixCls}--expanded`}
        style={{ background: 'rgba(251, 251, 251, 1)' }}
      >
        {/* 多选占位 */}
        {rowSelection ? <td /> : null}
        {/* 可展开内嵌显示 */}
        <td colSpan={columns.length + 1}>
          {expandedRow}
          {expanded === 'loading' && <Loading size="sm" />}
        </td>
      </tr>
    )
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
  columns: Column[]
  /**
   * 数据配置项
   */
  data: object[]
  /**
   * 第一行ref
   */
  // firstRowRef: React.RefObject<HTMLTableExpandedRowElement>
  fixedColWidth: number[]
  rowSelection?: RowSelection
}

if (__DEV__) {
  TableExpandedRow.displayName = 'TableExpandedRow'
}
