import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Pagination from '@hi-ui/pagination'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'

const _role = 'table'
const _prefix = getPrefixCls('table')

const STANDARD_PRESET = {
  showColMenu: true,
  sticky: true,
  bordered: true,
  setting: true,
  striped: true,
}

/**
 * TODO: What is Table
 */
export const Table = forwardRef<HTMLDivElement | null, TableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      striped = false,
      loading = false,
      standard = false,
      extra,
      ...rest
    },
    ref
  ) => {
    const standardPreset = standard ? STANDARD_PRESET : {}

    // 预处理 column 支持 多选渲染

    const providedValue = useTable({ ...standardPreset, ...rest })

    const {
      // striped,
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
      scrollSize,
      leftFrozenColKeys,
      rightFrozenColKeys,
      // fixedColumnsWidth,
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
      scrollLeft,
      scrollRight,
    } = providedValue

    const cls = cx(
      prefixCls,
      className,
      bordered && `${prefixCls}--bordered`,
      striped && `${prefixCls}--striped`,
      size && `${prefixCls}--size-${size}`
    )

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项

    return (
      <div ref={ref} role={role} className={cls}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider value={providedValue}>
            <div style={{ position: 'relative' }}>
              <TableHeader
                prefixCls={prefixCls}
                fixedColWidth={fixedColWidth}
                rowSelection={rowSelection}
              />

              {/* 不跟随内部 header 横向滚动，固定到右侧 */}
              {extra ? (
                <div style={{ position: 'absolute', right: 0, zIndex: 11, bottom: 0, top: 0 }}>
                  {extra}
                </div>
              ) : null}
            </div>

            <TableBody
              data={cacheData}
              prefixCls={prefixCls}
              firstRowRef={firstRowRef}
              fixedColWidth={fixedColWidth}
              rowSelection={rowSelection}
            />
          </TableProvider>

          {/* 左右冻结列内侧阴影效果 */}
          {scrollLeft > 0 && leftFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow  ${prefixCls}-freeze-shadow--left`}
              style={{ width: leftFixedColumnsWidth + 'px' }}
            />
          ) : null}
          {scrollRight > 0 && rightFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow ${prefixCls}-freeze-shadow--right`}
              style={{ width: rightFixedColumnsWidth + 'px' }}
            />
          ) : null}
        </div>

        {/* 外置 Pagination 分页组件 */}
        {pagination ? (
          <div
            className={cx(
              `${prefixCls}__pagination`,
              pagination.placement && `${prefixCls}__pagination--${pagination.placement}`
            )}
          >
            <Pagination {...pagination} current={currentPage} onChange={trySetCurrentPage} />
          </div>
        ) : null}
      </div>
    )
  }
)

export interface TableProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDrop' | 'draggable' | 'onDragStart'>,
    UseTableProps {}

if (__DEV__) {
  Table.displayName = 'Table'
}
