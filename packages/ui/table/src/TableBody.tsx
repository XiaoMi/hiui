import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableRow } from './TableRow'
import { useTableContext } from './context'
import { useLatestCallback } from '@hi-ui/use-latest'
import { TableRowRequiredProps } from './types'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableBody
 */
export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix }, ref) => {
    const {
      columns,
      leafColumns,
      firstRowElementRef,
      isExpandTreeRows,
      transitionData,
      getColgroupProps,
      bodyTableRef,
      scrollBodyElementRef,
      onTableBodyScroll,
      maxHeight,
      // fixedColWidth,
    } = useTableContext()

    const cls = cx(`${prefixCls}__body`)

    // const calcColPosition = (col, idx) => {
    //   // TODO: 前缀和优化
    //   return fixedColWidth
    //     .slice(0, idx)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    // }

    const getTreeNodeRequiredProps = useLatestCallback(
      (id: React.ReactText): TableRowRequiredProps => {
        return {
          expandedTree: isExpandTreeRows(id),
          // checked: isCheckedId(id),
          // semiChecked: isSemiCheckedId(id),
          // selected: selectedId === id,
          // loading: isLoadingId(id),
          // focused: focusedId === id,
        }
      }
    )

    // TODO: 空状态

    // console.log('transitionData', transitionData)
    // const sticky = typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'

    return (
      // 外层增加 div 作为滚动容器
      <div
        ref={scrollBodyElementRef}
        className={cls}
        onScroll={onTableBodyScroll}
        style={{
          maxHeight: maxHeight || 'auto',
          // maxHeight 小于 table 实际高度才出现纵向滚动条
          overflowY:
            bodyTableRef.current && bodyTableRef.current.clientHeight > maxHeight
              ? 'scroll'
              : undefined,
          // 表格宽度大于div宽度才出现横向滚动条
          overflowX:
            bodyTableRef.current &&
            scrollBodyElementRef.current &&
            scrollBodyElementRef.current.clientWidth < bodyTableRef.current.clientWidth
              ? 'scroll'
              : undefined,
        }}
      >
        <table ref={bodyTableRef} style={{ width: '100%' }}>
          <colgroup>
            {leafColumns.map((col, idx) => {
              return (
                <col key={idx} className={`${prefixCls}-col`} {...getColgroupProps(col, idx)} />
              )
            })}
          </colgroup>
          <tbody>
            {transitionData.map((row, index) => {
              return (
                <TableRow
                  ref={index === 0 ? firstRowElementRef : null}
                  // key={depth + index}
                  key={row.id}
                  rowIndex={index}
                  rowData={row}
                  setDragRowKey={() => {}}
                  setDragStatus={() => {}}
                  // expandedTree={isExpandTreeRows(row.id)}
                  {...getTreeNodeRequiredProps(row.id)}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
)

export interface TableBodyProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
}

if (__DEV__) {
  TableBody.displayName = 'TableBody'
}
