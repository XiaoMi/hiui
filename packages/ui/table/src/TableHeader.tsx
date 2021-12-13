import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { Checkbox } from '@hi-ui/checkbox'
import { __DEV__ } from '@hi-ui/env'
import { TableColumnItem, TableRowSelection } from './types'
import { useTableContext } from './context'
import { isFunction } from '@hi-ui/type-assertion'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableHeader
 */
export const TableHeader = forwardRef<HTMLDivElement | null, TableHeaderProps>(
  ({ prefixCls = _prefix, fixedColWidth }, ref) => {
    const {
      rowSelection,
      checkedRowKeys,
      trySetCheckedRowKeys,
      groupedColumns,
      columns,
      resizable,
      colWidths,
      bordered,
      maxHeight,
      sticky,
      stickyTop,
      tryCheckAllRow,
      checkedAll,
      halfChecked,
    } = useTableContext()

    const calcColPosition = (col, idx) => {
      // TODO: 前缀和优化
      return fixedColWidth
        .slice(0, idx)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    // TODO: 需要增加一下错误提示，比如rowSelection类型不合法等等
    const cls = cx(`${prefixCls}__header`)

    const checkboxStyle: React.CSSProperties =
      fixedColWidth && fixedColWidth.length > 0 ? { position: 'sticky', left: 0 } : {}

    return (
      <div
        className={cls}
        style={{
          borderLeft: bordered ? '1px solid #e7e7e7' : undefined,
          borderTop: bordered ? '1px solid #e7e7e7' : undefined,
          boxShadow: maxHeight && '0px 2px 6px 0px rgba(0,0,0,0.12)',
          position: sticky ? 'sticky' : 'relative',
          top: sticky && stickyTop,
          zIndex: 10,
        }}
      >
        {/* header 内置 table，利用 table colgroup 特性，实现单独表头的分组 */}
        <table style={{ width: '100%' }}>
          <colgroup>
            {groupedColumns.map((col, idx) => {
              const width = resizable ? colWidths[idx] : col.width
              return <col key={idx} style={{ width, minWidth: width }} />
            })}
          </colgroup>
          <thead>
            <tr>
              {/* 渲染 checkbox */}
              {rowSelection ? (
                <th style={checkboxStyle}>
                  <Checkbox
                    checked={checkedAll}
                    indeterminate={halfChecked}
                    onChange={tryCheckAllRow}
                  />
                </th>
              ) : null}

              {/* 渲染列 */}
              {columns.map((col, idx) => {
                const {
                  dataKey,
                  colSpan,
                  rowSpan,
                  title,
                  align,
                  leftStickyWidth,
                  rightStickyWidth,
                } = col.raw || {}

                const isSticky =
                  typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'

                // const isRowActive =
                //   highlightedColKeys.includes(dataKey) || highlightColumns.includes(dataKey)
                // const isColActive = showColHighlight && hoverColIndex === dataKey
                // const defatultTextAlign = align || 'left'

                const style: React.CSSProperties = fixedColWidth[idx]
                  ? {
                      position: 'sticky',
                      left: calcColPosition(col, idx),
                      // 获得对齐的列
                      textAlign: 'center',
                    }
                  : {}

                const titleContent = isFunction(title) ? title(col) : title

                return (
                  <th key={dataKey} style={style}>
                    {titleContent}
                  </th>
                )
              })}
            </tr>
          </thead>
        </table>
      </div>
    )
  }
)

export interface TableHeaderProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: TableColumnItem[]
  fixedColWidth: number[]
  rowSelection?: TableRowSelection
}

if (__DEV__) {
  TableHeader.displayName = 'TableHeader'
}
