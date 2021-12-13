import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableRow } from './TableRow'
import { useTableContext } from './context'
// import { Column, RowSelection } from './Table'
// import { Checkbox } from '@hi-ui/checkbox'
import { useLatestCallback } from '@hi-ui/use-latest'
import { TableRowRequiredProps } from './types'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableBody
 */
export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix, columns, firstRowRef, fixedColWidth, rowSelection }, ref) => {
    const {
      data,
      firstRowElementRef,
      isExpandTreeRows,
      height,
      itemHeight = 40,
      virtual = false,
      transitionData,
      onNodeToggleEnd,
    } = useTableContext()

    const cls = cx(`${prefixCls}__body`)

    const calcColPosition = (col, idx) => {
      // TODO: 前缀和优化
      return fixedColWidth
        .slice(0, idx)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

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

    return (
      <tbody className={cls}>
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
    )
  }
)

export interface TableBodyProps {
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
  firstRowRef: React.RefObject<HTMLTableRowElement>
  fixedColWidth: number[]
  rowSelection?: RowSelection
}

if (__DEV__) {
  TableBody.displayName = 'TableBody'
}
