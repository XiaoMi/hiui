import React, { forwardRef } from 'react'
import { Resizable } from 'react-resizable'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import { useCheckState } from '@hi-ui/use-check-state'
import { getNodeAncestors } from '@hi-ui/tree-utils'
import { useTableContext } from './context'
import { renderFilter } from './TableAdvancedFilter'

const _prefix = getPrefixCls('table-header')

export const TheadContent = forwardRef<HTMLDivElement | null, TheadContentProps>(
  ({ prefixCls = _prefix, ...rest }, ref) => {
    const {
      groupedColumns,
      resizable,
      colWidths,
      isHoveredHighlightCol,
      isHighlightedCol,
      onColumnResizable,
      getStickyColProps,
      showColMenu,
      setHeaderTableElement,
      onResizeStop,
    } = useTableContext()

    const activeColumnKeysAction = useCheckState()

    return (
      <thead {...rest}>
        {/* 渲染列 */}
        {groupedColumns.map((cols, colsIndex) => {
          return (
            <tr key={colsIndex} ref={setHeaderTableElement}>
              {cols.map((col, colIndex) => {
                const { dataKey, title, raw } = col || {}
                let titleContent = isFunction(title) ? title(col) : title

                titleContent = resizable ? (
                  <span className={`${prefixCls}-header__title`}>{titleContent}</span>
                ) : (
                  titleContent
                )

                // 是否是表头分组最后一列单元格
                let groupLastColumn = false
                if (groupedColumns.length > 1 && colIndex === cols.length - 1) {
                  const nodeAncestors = getNodeAncestors(col)
                  if (
                    colsIndex === 0 ||
                    nodeAncestors?.[nodeAncestors.length - 1]?.id ===
                      groupedColumns[0][groupedColumns[0].length - 1].id
                  ) {
                    groupLastColumn = true
                  }
                }

                const cell = (
                  <th
                    key={dataKey}
                    {...getStickyColProps(col)}
                    className={cx(
                      `${prefixCls}-cell`,
                      raw.className,
                      isHighlightedCol(dataKey!) && `${prefixCls}-cell__col--highlight`,
                      isHoveredHighlightCol(dataKey!) &&
                        `${prefixCls}-cell__col--hovered-highlight`,
                      activeColumnKeysAction.has(dataKey!) && `${prefixCls}-cell__col--active`,
                      groupLastColumn && `${prefixCls}-cell--group-last-column`
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
                    onResizeStop={(evt, options) => {
                      onResizeStop?.(evt, options?.size, colIndex, colWidths)
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
    )
  }
)

export interface TheadContentProps extends HiBaseHTMLProps<'thead'> {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
}

if (__DEV__) {
  TheadContent.displayName = 'TheadContent'
}
