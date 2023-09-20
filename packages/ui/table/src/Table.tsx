import React, { forwardRef, Fragment, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import Pagination from '@hi-ui/pagination'
import {
  TableColumnItem,
  TablePaginationProps,
  TableRowEventData,
  TableRowSelection,
  FlattedTableRowData,
  TableDataSource,
} from './types'
import { useColHidden } from './hooks/use-col-hidden'
import { useColSorter } from './hooks/use-col-sorter'
import { useTablePagination } from './hooks/use-pagination'
import { withDefaultProps } from '@hi-ui/react-utils'
import { TableSettingMenu } from './TableSettingMenu'
import Loading from '@hi-ui/loading'
import Checkbox from '@hi-ui/checkbox'
import { useTableCheck } from './hooks/use-check'
import { isNullish } from '@hi-ui/type-assertion'
import { cloneTree, flattenTree } from '@hi-ui/tree-utils'
import { BaseTable, BaseTableProps } from './BaseTable'
import { uuid } from './utils'
import { useColSet } from './hooks/use-col-set'

const _prefix = getPrefixCls('table')

const STANDARD_PRESET = {
  striped: true,
  bordered: true,
  sticky: true,
  setting: true,
  showColMenu: true,
}

export const SELECTION_DATA_KEY = `SELECTION_DATA_KEY_${uuid()}`
const DEFAULT_DATA = [] as []

const DEFAULT_PAGINATION = {
  placement: 'right',
  autoHide: false,
}

/**
 * 表格
 */
export const Table = forwardRef<HTMLDivElement | null, TableProps>(
  (
    {
      prefixCls = _prefix,
      standard = false,
      loading: loadingProp = false,
      dataSource,
      pagination: paginationProp,
      uniqueId,
      columns: columnsProp,
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
      onHiddenColKeysChange,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      onSortedColKeysChange,
      checkDisabledColKeys,
      onSetColKeysChange,
      rowSelection,
      fieldKey = 'key',
      extra,
      data = DEFAULT_DATA,
      virtual,
      ...rest
    },
    ref
  ) => {
    // ************************ 预置标准模式 ************************ //

    const tableProps = withDefaultProps(rest, standard ? STANDARD_PRESET : undefined)
    const { setting = false, ...baseTableProps } = tableProps

    // ************************ 高级功能 ************************ //
    // ***根据列字段合并sortedColKeysProp,和hiddenColKeys
    const { sortedColKeys: sortedColKeysProp, hiddenColKeys: hiddenColKeysProp } = useColSet({
      columns: columnsProp,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
    })

    /**
     * 列排序
     */
    const { sortedCols, setSortColKeys, cacheSortedCols, setCacheSortedCols } = useColSorter({
      uniqueId,
      columns: columnsProp,
      sortedColKeys: sortedColKeysProp,
      onSortedColKeysChange,
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
      // 基于排序的 columns，隐藏的也能排序
      columns: sortedCols,
      hiddenColKeys: hiddenColKeysProp,
      onHiddenColKeysChange,
    })

    let pagination = withDefaultProps(paginationProp, DEFAULT_PAGINATION)

    /**
     * 数据分页
     */
    const {
      loading,
      mergedData,
      currentPage,
      trySetCurrentPage,
      pageSize,
      trySetPageSize,
      total,
    } = useTablePagination({
      loadingProp,
      pagination,
      data,
      dataSource,
    })

    // 可能是从 dataSource 中拿到的 total 值，在此更新该值
    pagination = {
      ...pagination,
      total,
    }

    // 优化数据在第一页且数据一页内时，不展示 pagination 配置项
    const hiddenPagination =
      !paginationProp ||
      (pagination.autoHide &&
        currentPage === 1 &&
        typeof pagination.pageSize === 'number' &&
        typeof pagination.total === 'number' &&
        pagination.total <= pagination.pageSize &&
        data.length <= pagination.pageSize)

    // 获取 key 字段值
    const getRowKeyField = useCallback(
      (item: any) => {
        const val = item[fieldKey]

        invariant(
          !isNullish(val),
          'Not found for the unique %s attribute in each row of data prop.',
          fieldKey
        )

        return val
      },
      [fieldKey]
    )

    /**
     * 扁平化数据，支持树形 table
     */
    const flattedData = useMemo(() => {
      // 对于分页来讲，flattedData 应该是当前页的数据
      const clonedData = cloneTree(mergedData) as any
      return flattenTree(clonedData, (node: any) => {
        // 兼容老api，映射 key 为 id
        return { ...node, id: getRowKeyField(node.raw) }
      }) as FlattedTableRowData[]
    }, [mergedData, getRowKeyField])

    // ************************ 行多选 ************************ //

    // 自定义设置 checkbox 列宽度
    const checkboxColWidth = React.useMemo(() => {
      return rowSelection && typeof rowSelection.checkboxColWidth === 'number'
        ? rowSelection.checkboxColWidth
        : 38
    }, [rowSelection])

    // 预处理 column 支持 多选渲染
    const {
      checkedAll,
      semiChecked,
      tryCheckAllRow,
      isCheckedRowKey,
      onCheckedRowKeysChange,
      checkRowIsDisabledCheckbox,
    } = useTableCheck({ rowSelection, flattedData, fieldKey })

    // 表格列多选操作区
    const getSelectionColumn = React.useCallback(
      (rowSelection: TableRowSelection) => {
        const renderCell = (_: any, rowItem: any, rowIndex: number) => {
          const rowKey = getRowKeyField(rowItem)
          const checked = isCheckedRowKey(rowKey)
          const disabledCheckbox = checkRowIsDisabledCheckbox(rowItem)

          return {
            node: (
              <Checkbox
                checked={isCheckedRowKey(rowKey)}
                disabled={disabledCheckbox}
                onChange={(evt) => {
                  onCheckedRowKeysChange(rowItem, evt.target.checked)
                }}
                onClick={(evt) => {
                  evt.stopPropagation()
                }}
              />
            ),
            checked,
          }
        }

        // TODO: && isFixed !== 'right' && !isSumRow && !isAvgRow
        const renderSelectionCell = (
          _: any,
          rowItem: TableRowEventData,
          rowIndex: number,
          dataKey: string
        ) => {
          const { node, checked } = renderCell(_, rowItem, rowIndex)

          // 自定义渲染
          // @ts-ignore
          if (rowSelection.render) {
            // TODO: 获取 requiredProps 方法
            // @ts-ignore
            return rowSelection.render(node, { ...rowItem, checked }, rowIndex, dataKey)
          }

          return node
        }

        const renderTitleCell = () => {
          return {
            node: (
              <Checkbox
                checked={checkedAll}
                indeterminate={semiChecked}
                onChange={tryCheckAllRow}
              />
            ),
            checked: checkedAll,
            semiChecked: semiChecked,
          }
        }

        const renderSelectionTitleCell = () => {
          const { node } = renderTitleCell()

          if (rowSelection.checkAllOptions) {
            if (rowSelection.checkAllOptions.render) {
              return rowSelection.checkAllOptions.render(node)
            }

            if (rowSelection.checkAllOptions.filterIcon) {
              return (
                <>
                  {node}
                  {rowSelection.checkAllOptions.filterIcon}
                </>
              )
            }
          }

          return node
        }

        const selectionColumn: TableColumnItem = {
          dataKey: SELECTION_DATA_KEY,
          width: checkboxColWidth,
          className: `${prefixCls}__selection-col`,
          title: renderSelectionTitleCell,
          // @ts-ignore
          render: renderSelectionCell,
        }
        return selectionColumn
      },
      [
        getRowKeyField,
        checkedAll,
        semiChecked,
        tryCheckAllRow,
        checkboxColWidth,
        isCheckedRowKey,
        onCheckedRowKeysChange,
        checkRowIsDisabledCheckbox,
        prefixCls,
      ]
    )

    const mergedColumns = React.useMemo(() => {
      if (rowSelection) {
        const selectionColumn = getSelectionColumn(rowSelection)
        return [selectionColumn, ...visibleCols]
      }

      return visibleCols
    }, [rowSelection, getSelectionColumn, visibleCols])

    // ************************ loading ************************ //

    const TableWrapper = loading ? Loading : Fragment

    return (
      <TableWrapper>
        <BaseTable
          ref={ref}
          {...baseTableProps}
          prefixCls={prefixCls}
          columns={mergedColumns}
          data={mergedData}
          fieldKey={fieldKey}
          virtual={virtual}
          extra={{
            header: setting ? (
              <TableSettingMenu
                prefixCls={`${prefixCls}-setting`}
                // sort
                sortedCols={sortedCols}
                setSortColKeys={setSortColKeys}
                cacheSortedCols={cacheSortedCols}
                setCacheSortedCols={setCacheSortedCols}
                // hidden
                hiddenColKeys={hiddenColKeys}
                setHiddenColKeys={setHiddenColKeys}
                cacheHiddenColKeys={cacheHiddenColKeys}
                setCacheHiddenColKeys={setCacheHiddenColKeys}
                checkDisabledColKeys={checkDisabledColKeys}
                onSetColKeysChange={onSetColKeysChange}
              />
            ) : null,
            footer:
              dataSource || !hiddenPagination ? (
                <Pagination
                  className={cx(
                    `${prefixCls}-pagination`,
                    pagination.placement &&
                      `${prefixCls}-pagination--placement-${pagination.placement}`
                  )}
                  {...pagination}
                  current={currentPage}
                  onChange={trySetCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={trySetPageSize}
                />
              ) : null,
            ...extra,
          }}
        />
      </TableWrapper>
    )
  }
)

export interface TableProps extends BaseTableProps {
  /**
   * 加载中状态
   */
  loading?: boolean
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
   *  排序列（受控)，需要 column 中必须传入唯一的 dataKey 用于列隐藏
   */
  sortedColKeys?: string[]
  /**
   *  列排序设置时回调
   */
  onSortedColKeysChange?: (sortedColKeys: string[]) => void
  /**
   * checkbox 被禁用的列
   */
  checkDisabledColKeys?: string[]
  /**
   *  列设置时回调
   */
  onSetColKeysChange?: (sortedColKeys: string[], hiddenColKeys: string[]) => void
  /**
   *  表格分页配置项
   */
  pagination?: TablePaginationProps & { pageSize: number }
  /**
   *  异步数据源，分页切换时加载数据
   */
  dataSource?: (current: number, pageSize?: number) => TableDataSource
}

if (__DEV__) {
  Table.displayName = 'Table'
}
