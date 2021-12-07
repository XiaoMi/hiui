import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { Checkbox } from '@hi-ui/checkbox'
import { __DEV__ } from '@hi-ui/env'
import { Column, RowSelection } from './Table'
import { useTableContext } from './context'
import { isFunction } from '@hi-ui/type-assertion'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableHeader
 */
export const TableHeader = forwardRef<HTMLDivElement | null, TableHeaderProps>(
  ({ prefixCls = _prefix, columns, fixedColWidth, rowSelection, titleRender }, ref) => {
    // TODO: 需要增加一下错误提示，比如rowSelection类型不合法等等
    const cls = cx(`${prefixCls}__header`)
    // const { rowSelection } = useTableContext()

    const { onChange, selectedRowKeys } = rowSelection || {}

    const calcColPosition = (col, idx) => {
      // TODO: 前缀和优化
      return fixedColWidth
        .slice(0, idx)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    return (
      <thead className={cls}>
        <tr>
          {/* 渲染 checkbox */}
          {/* {rowSelection ? (
            <th
              style={
                fixedColWidth && fixedColWidth.length > 0 ? { position: 'sticky', left: 0 } : {}
              }
            >
              <Checkbox />
            </th>
          ) : null} */}
          {columns.map((col, idx) => {
            const {
              rightStickyWidth,
              leftStickyWidth,
              dataKey,
              align,
              colSpan,
              rowSpan,
              title,
              isLast,
            } = col

            const isSticky =
              typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'

            // const isRowActive =
            //   highlightedColKeys.includes(dataKey) || highlightColumns.includes(dataKey)
            // const isColActive = showColHighlight && hoverColIndex === dataKey
            // const defatultTextAlign = align || 'left'

            return (
              <th
                key={col.dataKey}
                style={
                  fixedColWidth[idx]
                    ? {
                        position: 'sticky',
                        left: calcColPosition(col, idx),
                        // 获得对齐的列
                        textAlign: 'center',
                      }
                    : {}
                }
              >
                {col.title}
                {isFunction(titleRender) ? titleRender(col) : title}
              </th>
            )
          })}
        </tr>
      </thead>
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
  columns: Column[]
  fixedColWidth: number[]
  rowSelection?: RowSelection
}

if (__DEV__) {
  TableHeader.displayName = 'TableHeader'
}
