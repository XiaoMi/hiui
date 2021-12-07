import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableRow } from './TableRow'
// import { Column, RowSelection } from './Table'
// import { Checkbox } from '@hi-ui/checkbox'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableBody
 */
export const TableBody = forwardRef<HTMLDivElement | null, TableBodyProps>(
  ({ prefixCls = _prefix, data, columns, firstRowRef, fixedColWidth, rowSelection }, ref) => {
    const cls = cx(`${prefixCls}__body`)

    const calcColPosition = (col, idx) => {
      // TODO: 前缀和优化
      return fixedColWidth
        .slice(0, idx)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    const renderRow = ({ col, index, depth, row }) => {
      return (
        <>
          <TableRow
            key={depth + index}
            rowIndex={index}
            rowData={row}
            setDragRowKey={() => {}}
            setDragStatus={() => {}}
          />
        </>
      )
    }

    // TODO: 空状态

    return (
      <tbody className={cls}>
        {data.map((row, index) => {
          return renderRow({ row, depth: 0, index })
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
