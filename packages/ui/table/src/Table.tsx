import React, { forwardRef, Fragment, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import Pagination from '@hi-ui/pagination'
import {
  TableColumnItem,
  TablePaginationProps,
  TableRowEventData,
  TableRowSelection,
  FlattedTableRowData,
} from './types'
import { useColHidden } from './hooks/use-col-hidden'
import { useColSorter } from './hooks/use-col-sorter'
import { useTablePagination } from './hooks/use-pagination'
import { withDefaultProps } from '@hi-ui/react-utils'
import { TableSettingMenu } from './TableSettingMenu'
import { AxiosRequestConfig } from 'axios'
import Loading from '@hi-ui/loading'
import Checkbox from '@hi-ui/checkbox'
import { useTableCheck } from './hooks/use-check'
import { isNullish } from '@hi-ui/type-assertion'
import { cloneTree, flattenTree } from '@hi-ui/tree-utils'
import { BaseTable, BaseTableProps } from './BaseTable'

const _prefix = getPrefixCls('table')

const STANDARD_PRESET = {
  striped: true,
  bordered: true,
  sticky: true,
  setting: true,
  showColMenu: true,
}

const DEFAULT_DATA = [] as []

/**
 * TODO: What is Table
 */
export const Table = forwardRef<HTMLDivElement | null, TableProps>(
  (
    {
      prefixCls = _prefix,
      standard = false,
      loading = false,
      dataSource,
      pagination,
      uniqueId,
      columns: columnsProp,
      hiddenColKeys: hiddenColKeysProp,
      onHiddenColKeysChange,
      rowSelection,
      fieldKey = 'key',
      data = DEFAULT_DATA,
      ...rest
    },
    ref
  ) => {
    // ************************ 预置标准模式 ************************ //

    const baseTableProps = withDefaultProps(rest, standard ? STANDARD_PRESET : undefined)
    const setting = baseTableProps.setting ?? false

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

    /**
     * 数据分页
     * TODO: 优化数据在一页内时，不展示 pagination 配置项
     */
    const { mergedData, currentPage, trySetCurrentPage } = useTablePagination({
      pagination,
      data,
      dataSource,
    })

    /**
     * 获取 key 字段值
     */
    const getRowKeyField = React.useCallback(
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
      // @ts-ignore
      const clonedData = cloneTree(data)

      // @ts-ignore
      return flattenTree(clonedData, (node: any) => {
        // TODO: flattenTree 内置了 id 结构，需要处理 key 映射为 id
        return { ...node, id: getRowKeyField(node.raw) }
      }) as FlattedTableRowData[]
    }, [data, getRowKeyField])

    // 预处理 column 支持 多选渲染
    const {
      checkedAll,
      semiChecked,
      tryCheckAllRow,
      isCheckedRowKey,
      onCheckedRowKeysChange,
    } = useTableCheck({ rowSelection, flattedData, getRowKeyField })

    // 自定义设置 checkbox 列宽度
    const checkboxColWidth = React.useMemo(() => {
      return rowSelection && typeof rowSelection.checkboxColWidth === 'number'
        ? rowSelection.checkboxColWidth
        : 50
    }, [rowSelection])

    /**
     * 表格列多选操作区
     */
    const getSelectionColumn = React.useCallback(
      (rowSelection: TableRowSelection) => {
        const renderCell = (_: any, rowItem: any, rowIndex: number) => {
          // const rowKey = getRowKeyField(rowItem)
          const rowKey = rowItem.id
          const checked = isCheckedRowKey(rowKey)
          console.log('rowItem', rowItem)

          const checkboxConfig =
            rowSelection &&
            rowSelection.getCheckboxConfig &&
            rowSelection.getCheckboxConfig(rowItem)
          const checkboxDisabled = (checkboxConfig && checkboxConfig.disabled) || false

          return {
            node: (
              <Checkbox
                checked={isCheckedRowKey(rowKey)}
                disabled={checkboxDisabled}
                onChange={(evt) => {
                  onCheckedRowKeysChange(rowItem, evt.target.checked)
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
          const { node } = renderCell(_, rowItem, rowIndex)

          if (rowSelection!.render) {
            // @ts-ignore
            return rowSelection!.render(node, rowItem, rowIndex, rowItem.id)
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
            checked: false,
            semiChecked: false,
          }
        }

        const renderSelectionTitleCell = () => {
          const { node } = renderTitleCell()

          if (rowSelection.checkAllOptions && rowSelection.checkAllOptions.render) {
            return rowSelection.checkAllOptions.render(node)
          }

          return node
        }

        const selectionColumn: TableColumnItem = {
          width: checkboxColWidth,
          className: `${prefixCls}-selection-column`,
          title: renderSelectionTitleCell,
          // @ts-ignore
          render: renderSelectionCell,
        }
        return selectionColumn
      },
      [
        checkedAll,
        semiChecked,
        tryCheckAllRow,
        checkboxColWidth,
        // getRowKeyField,
        isCheckedRowKey,
        onCheckedRowKeysChange,
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

    const TableWrapper = loading ? Loading : Fragment

    return (
      <TableWrapper>
        <BaseTable
          ref={ref}
          {...baseTableProps}
          prefixCls={prefixCls}
          columns={mergedColumns}
          data={mergedData}
          extra={{
            header: setting ? (
              <TableSettingMenu
                prefixCls={`${prefixCls}-setting`}
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
            ) : null,
          }}
        />
        {pagination ? (
          <Pagination
            className={cx(
              `${prefixCls}-pagination`,
              `${prefixCls}-pagination--placement-${pagination.placement ?? 'right'}`
            )}
            {...pagination}
            current={currentPage}
            onChange={trySetCurrentPage}
          />
        ) : null}
      </TableWrapper>
    )
  }
)

export interface TableProps extends Omit<BaseTableProps, 'extra' | 'role'> {
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
