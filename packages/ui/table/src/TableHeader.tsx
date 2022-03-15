import React, { forwardRef } from 'react'
import { Resizable } from 'react-resizable'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import { useTableContext } from './context'
import { renderFilter } from './TableAdvancedFilter'
import { useCheckState } from '@hi-ui/use-check-state'

const _prefix = getPrefixCls('table-header')

/**
 * TODO: What is TableHeader
 */
export const TableHeader = forwardRef<HTMLDivElement | null, TableHeaderProps>(
  ({ prefixCls = _prefix, className }, ref) => {
    const {
      groupedColumns,
      resizable,
      colWidths,
      isHoveredHighlightCol,
      isHighlightedCol,
      getColgroupProps,
      onColumnResizable,
      getStickyColProps,
      onTableBodyScrollMock,
      scrollHeaderElementRef,
      leafColumns,
      getTableHeaderProps,
      showColMenu,
    } = useTableContext()

    const activeColumnKeysAction = useCheckState()

    const cls = cx(prefixCls, className)

    return (
      <div className={cls} ref={scrollHeaderElementRef} {...getTableHeaderProps()}>
        {/* header 内置 table，利用 table colgroup 特性，实现单独表头的分组 */}
        <table style={{ width: '100%', position: 'relative' }}>
          <colgroup>
            {leafColumns.map((col: any, idx) => {
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
                    const { dataKey, title, raw } = col || {}
                    const titleContent = isFunction(title) ? title(col) : title

                    const cell = (
                      <th
                        key={dataKey}
                        {...getStickyColProps(col)}
                        className={cx(
                          `${prefixCls}-cell`,
                          raw.className,
                          isHighlightedCol(dataKey!) && `${prefixCls}__col--highlight`,
                          isHoveredHighlightCol(dataKey!) && `${prefixCls}__col--hovered-highlight`,
                          activeColumnKeysAction.has(dataKey!) && `${prefixCls}__col--active`
                        )}
                        // @ts-ignore
                        colSpan={col.colSpan}
                        // @ts-ignore
                        rowSpan={col.rowSpan}
                      >
                        {titleContent}
                        {renderFilter({
                          prefixCls: `${prefixCls}-filter`,
                          columnKey: dataKey,
                          showColMenu,
                          column: col,
                          onOpen: () => activeColumnKeysAction.add(dataKey),
                          onClose: () => activeColumnKeysAction.remove(dataKey),
                        })}
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
  className?: string
}

if (__DEV__) {
  TableHeader.displayName = 'TableHeader'
}
