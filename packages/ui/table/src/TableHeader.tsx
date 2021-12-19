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
      rowSelection,
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
      semiChecked,
      getColgroupProps,
      onColumnResizable,
      getStickyColProps,
      onTableBodyScrollMock,
      onTableBodyScroll,
      scrollHeaderElementRef,
      fixedColWidth,
    } = useTableContext()

    // const calcColPosition = (col, idx) => {
    //   // TODO: 前缀和优化
    //   return fixedColWidth
    //     .slice(0, idx)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    // }

    // TODO: 需要增加一下错误提示，比如rowSelection类型不合法等等
    const cls = cx(`${prefixCls}__header`)

    const checkboxStyle: React.CSSProperties =
      fixedColWidth && fixedColWidth.length > 0 ? { position: 'sticky', left: 0 } : {}

    // console.log('groupedColumns', groupedColumns, colWidths)

    return (
      <div
        className={cls}
        ref={scrollHeaderElementRef}
        style={{
          borderLeft: bordered ? '1px solid #e7e7e7' : undefined,
          borderTop: bordered ? '1px solid #e7e7e7' : undefined,
          boxShadow: maxHeight && '0px 2px 6px 0px rgba(0,0,0,0.12)',
          position: sticky ? 'sticky' : 'relative',
          top: sticky && stickyTop,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* header 内置 table，利用 table colgroup 特性，实现单独表头的分组 */}
        <table style={{ width: '100%', position: 'relative' }}>
          <colgroup>
            {columns.map((col, idx) => {
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
                    // const isRowActive =
                    //   highlightedColKeys.includes(dataKey) || highlightColumns.includes(dataKey)
                    // const isColActive = showColHighlight && hoverColIndex === dataKey
                    // const defatultTextAlign = align || 'left'

                    // const style: React.CSSProperties = fixedColWidth[colIndex]
                    //   ? {
                    //       position: 'sticky',
                    //       left: calcColPosition(col, colIndex),
                    //       // 获得对齐的列
                    //       textAlign: 'center',
                    //     }
                    //   : {}

                    const titleContent = isFunction(title) ? title(col) : title

                    const cell = (
                      <th key={dataKey} {...getStickyColProps(col)}>
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
