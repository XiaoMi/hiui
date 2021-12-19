import React, { forwardRef } from 'react'
import { Resizable } from 'react-resizable'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import { Checkbox } from '@hi-ui/checkbox'
import { useTableContext } from './context'

const _prefix = getPrefixCls('table-header')

/**
 * TODO: What is TableHeader
 */
export const TableHeader = forwardRef<HTMLDivElement | null, TableHeaderProps>(
  ({ prefixCls = _prefix }, ref) => {
    const {
      columns,
      groupedColumns,
      resizable,
      colWidths,
      getColgroupProps,
      onColumnResizable,
      getStickyColProps,
      onTableBodyScrollMock,
      onTableBodyScroll,
      scrollHeaderElementRef,
      fixedColWidth,
      leafColumns,
      getTableHeaderProps,
    } = useTableContext()

    // TODO: 需要增加一下错误提示，比如rowSelection类型不合法等等
    const cls = cx(`${prefixCls}__header`)

    return (
      <div className={cls} ref={scrollHeaderElementRef} {...getTableHeaderProps()}>
        {/* header 内置 table，利用 table colgroup 特性，实现单独表头的分组 */}
        <table style={{ width: '100%', position: 'relative' }}>
          <colgroup>
            {leafColumns.map((col, idx) => {
              return (
                <col key={idx} className={`${prefixCls}-col`} {...getColgroupProps(col, idx)} />
              )
            })}
          </colgroup>
          <thead onWheel={onTableBodyScrollMock}>
            {/* 渲染列 */}
            {groupedColumns.map((cols, colsIndex) => {
              return (
                <tr key={colsIndex}>
                  {cols.map((col, colIndex) => {
                    const { dataKey, title } = col || {}
                    const titleContent = isFunction(title) ? title(col) : title

                    const cell = (
                      <th
                        key={dataKey}
                        {...getStickyColProps(col)}
                        colSpan={col.colSpan}
                        rowSpan={col.rowSpan}
                      >
                        {titleContent}
                      </th>
                    )

                    return resizable && colIndex !== colWidths.length - 1 ? (
                      <Resizable
                        key={colIndex}
                        className={`${prefixCls}__resizable`}
                        draggableOpts={{ enableUserSelectHack: false }}
                        handle={<span className={`${prefixCls}__resizable-handle`} />}
                        height={0}
                        width={colWidths[colIndex] as number}
                        onResize={(evt, options) => {
                          onColumnResizable(evt, options, colIndex)
                        }}
                      >
                        {cell}
                      </Resizable>
                    ) : (
                      cell
                    )
                  })}
                </tr>
              )
            })}
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
}

if (__DEV__) {
  TableHeader.displayName = 'TableHeader'
}
