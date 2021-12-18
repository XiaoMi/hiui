import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Pagination from '@hi-ui/pagination'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'
import { TableExtra, TablePaginationProps } from './types'
import { useColHidden } from './hooks/use-col-hidden'
import { useColSorter } from './hooks/use-col-sorter'
import { useTablePagination } from './hooks/use-pagination'
import { withDefaultProps } from '@hi-ui/react-utils'
import { TableSettingMenu } from './TableSettingMenu'
import { AxiosRequestConfig } from 'axios'

const _role = 'table'
const _prefix = getPrefixCls('table')

/**
 * TODO: What is BaseTable
 */
export const BaseTable = forwardRef<HTMLDivElement | null, BaseTableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      striped = false,
      loading = false,
      extra,
      ...rest
    },
    ref
  ) => {
    const extraHeader = extra && extra.header
    const extraFooter = extra && extra.footer

    const providedValue = useTable(rest)

    const {
      bordered,
      size,
      fixedColWidth,
      rowSelection,
      cacheData,
      firstRowRef,
      pagination,
      currentPage,
      trySetCurrentPage,
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
              {extraHeader ? (
                <div style={{ position: 'absolute', right: 0, zIndex: 11, bottom: 0, top: 0 }}>
                  {extraHeader}
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

          {/* 左冻结列内侧阴影效果 */}
          {scrollLeft > 0 && leftFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow  ${prefixCls}-freeze-shadow--left`}
              style={{ width: leftFixedColumnsWidth + 'px' }}
            />
          ) : null}
          {/* 右冻结列内侧阴影效果 */}
          {scrollRight > 0 && rightFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow ${prefixCls}-freeze-shadow--right`}
              style={{ width: rightFixedColumnsWidth + 'px' }}
            />
          ) : null}
        </div>

        {extraFooter}
      </div>
    )
  }
)

export interface BaseTableProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDrop' | 'draggable' | 'onDragStart'>,
    UseTableProps {
  extra?: TableExtra
}

if (__DEV__) {
  BaseTable.displayName = 'BaseTable'
}

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
      standard = false,
      uniqueId,
      columns: columnsProp,
      hiddenColKeys: hiddenColKeysProp,
      onHiddenColKeysChange,
      data,
      dataSource,
      pagination,
      ...rest
    },
    ref
  ) => {
    // ************************ 预置标准模式 ************************ //

    const baseTableProps = withDefaultProps(rest, standard ? STANDARD_PRESET : undefined)

    // ************************ 高级功能 ************************ //

    /**
     * 列排序
     */
    const { sortedCols, setSortCols, cacheSortedCols, setCacheSortedCols } = useColSorter({
      uniqueId,
      columns: columnsProp,
    })

    /**
     * 列隐藏
     */
    const {
      visibleCols,
      hiddenColKeys,
      setHiddenColKeys,
      cacheHiddenColKeys,
      setCacheHiddenColKeys,
    } = useColHidden({
      uniqueId,
      columns: sortedCols,
      hiddenColKeys: hiddenColKeysProp,
      onHiddenColKeysChange,
    })

    console.log(visibleCols, hiddenColKeys)

    /**
     * 表格分页
     */
    const { mergedData, currentPage, trySetCurrentPage } = useTablePagination({
      pagination,
      data,
      dataSource,
    })

    // 预处理 column 支持 多选渲染

    return (
      <>
        <BaseTable
          ref={ref}
          {...baseTableProps}
          prefixCls={prefixCls}
          columns={visibleCols}
          data={mergedData}
          extra={{
            header: (
              <TableSettingMenu
                prefixCls={prefixCls}
                sortedCols={sortedCols}
                setSortCols={setSortCols}
                cacheSortedCols={cacheSortedCols}
                setCacheSortedCols={setCacheSortedCols}
                // visibleCols={visibleCols}
                hiddenColKeys={hiddenColKeys}
                setHiddenColKeys={setHiddenColKeys}
                cacheHiddenColKeys={cacheHiddenColKeys}
                setCacheHiddenColKeys={setCacheHiddenColKeys}
              />
            ),
          }}
        />
        {pagination ? (
          <Pagination
            className={cx(
              `${prefixCls}-pagination`,
              pagination.placement && `${prefixCls}-pagination--${pagination.placement}`
            )}
            {...pagination}
            current={currentPage}
            onChange={trySetCurrentPage}
          />
        ) : null}
      </>
    )
  }
)

export interface TableProps extends Omit<BaseTableProps, 'extra' | 'role'> {
  /**
   *  标准模式，默认集成 `showColMenu = true, sticky = true, bordered = true, setting = true, striped = true`
   */
  standard?: boolean
  /**
   * 唯一 id 前缀，废弃
   */
  uniqueId?: string
  /**
   *  隐藏列（受控） (v3.9.0 新增)，需要 column 中必须传入唯一的 dataKey 用于列隐藏
   */
  hiddenColKeys?: string[]
  /**
   *  列隐藏设置时回调 (v3.9.0 新增)
   */
  onHiddenColKeysChange?: (hiddenColKeys: string[]) => void
  /**
   *  异步数据源
   */
  dataSource?: (current: number) => AxiosRequestConfig<any>
  /**
   *  表格分页配置项
   */
  pagination?: TablePaginationProps
}

if (__DEV__) {
  Table.displayName = 'Table'
}
