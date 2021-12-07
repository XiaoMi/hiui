import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import {
  HeaderRowFunc,
  TableColumnItem,
  TableDataSource,
  TableFixedOptions,
  TableRowSelection,
} from './types'
import Pagination, { PaginationProps } from '@hi-ui/pagination'
import { useTable } from './use-table'
import { TableProvider, useTableContext } from './context'

const _role = 'table'
const _prefix = getPrefixCls('table')

const DEFAULT_COLUMNS = [] as []
const DEFAULT_DATA = [] as []

/**
 * TODO: What is Table
 */
export const Table = forwardRef<HTMLDivElement | null, TableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      // data = DEFAULT_DATA,
      // columns = DEFAULT_COLUMNS,
      // fixedToColumn,
      // rowSelection,
      // striped,
      // bordered,
      // resizable,
      // size,
      // errorRowKeys = [],
      // highlightedRowKeys = [],
      // highlightedColKeys = [],
      // expandedRowKeys: propsExpandRowKeys,
      // expandRowKeys,
      // onExpand,
      // onHeaderRow,
      // expandedRender,
      // maxHeight,
      // pagination,
      // dataSource,
      // showColMenu,
      // showColHighlight,
      // sticky,
      // stickyTop = 0,
      // setting,
      // onLoadChildren,
      // rowExpandable,
      // hiddenColKeys,
      // scrollWidth,
      // draggable,
      // fieldKey,
      // onDragStart,
      // onDrop,
      // onDropEnd,
      // emptyContent,
      // getColKeyValue,
      // sortCols,
      // setSortCols,
      // cacheSortCols,
      // setCacheSortCols,
      // cacheHiddenColKeys,
      // setCacheHiddenColKeys,
      // setHiddenColKeys,
      ...rest
    },
    ref
  ) => {
    const providedValue = useTable(rest)

    const {
      striped,
      bordered,
      size,
      columns,
      fixedColWidth,
      rowSelection,
      cacheData,
      firstRowRef,
      pagination,
      currentPage,
      trySetCurrentPage,
    } = providedValue

    const cls = cx(
      prefixCls,
      className,
      striped && `${prefixCls}--striped`,
      bordered && `${prefixCls}--bordered`,
      size && `${prefixCls}--${size}`
    )

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项

    return (
      <div ref={ref} role={role} className={cls}>
        <TableProvider value={providedValue}>
          <table>
            <TableHeader
              columns={columns}
              prefixCls={prefixCls}
              fixedColWidth={fixedColWidth}
              rowSelection={rowSelection}
            />
            <TableBody
              columns={columns}
              data={cacheData}
              prefixCls={prefixCls}
              firstRowRef={firstRowRef}
              fixedColWidth={fixedColWidth}
              rowSelection={rowSelection}
            />
          </table>
        </TableProvider>

        {/* TODO: 外置 Pagination 分页组件 */}
        {/* {pagination ? (
          <div
            className={cx(
              `${prefixCls}__pagination`,
              pagination.placement && `${prefixCls}__pagination--${pagination.placement}`
            )}
          >
            <Pagination {...pagination} current={currentPage} onChange={trySetCurrentPage} />
          </div>
        ) : null} */}
      </div>
    )
  }
)

export interface TableProps extends Omit<HiBaseHTMLProps<'div'>, 'onDrop'> {}

if (__DEV__) {
  Table.displayName = 'Table'
}
