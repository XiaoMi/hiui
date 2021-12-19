import React, { forwardRef, Fragment, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Pagination from '@hi-ui/pagination'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'
import {
  TableColumnItem,
  TableExtra,
  TablePaginationProps,
  TableRowEventData,
  TableRowSelection,
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
import { isNullish, isFunction } from '@hi-ui/type-assertion'
import { cloneTree, flattenTree } from '@hi-ui/tree-utils'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheck } from '@hi-ui/use-check'
import { IconButton } from '@hi-ui/icon-button'
import { defaultCollapseIcon, defaultExpandIcon, defaultLoadingIcon } from './icons'

const _role = 'table'
const _prefix = getPrefixCls('table')

const DEFAULT_COLUMNS = [] as []

/**
 * TODO: What is BaseTable
 */
export const BaseTable = forwardRef<HTMLDivElement | null, BaseTableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      bordered: borderedProp,
      columns = DEFAULT_COLUMNS,
      striped = false,
      rowExpandable = false,
      expandEmbedRowKeys: expandEmbedRowKeysProp,
      onEmbedExpand,
      expandedRender,
      extra,
      ...rest
    },
    ref
  ) => {
    // ********************** 内嵌式面板 *********************** //

    /**
     * 行内嵌面板展开
     */
    const [expandEmbedRows, trySetExpandEmbedRows] = useUncontrolledState(
      // 展开全部
      [],
      expandEmbedRowKeysProp,
      onEmbedExpand
    )

    const [onExpandEmbedRowsChange, isExpandEmbedRows] = useCheck({
      checkedIds: expandEmbedRows,
      onCheck: trySetExpandEmbedRows as any,
      idFieldName: 'key',
    })

    // 异步展开内嵌面板

    /**
     * 表格列展开折叠操作区
     */
    const getEmbedPanelColumn = useCallback(
      (embedExpandable: any) => {
        const renderSwitcher = ({
          prefixCls,
          rowExpand,
          sticky,
          expanded,
          onNodeExpand,
          expandIcon,
          collapseIcon,
        }: {
          prefixCls: string
          rowExpand: any
          sticky: boolean
          expanded: boolean
          onNodeExpand: any
          expandIcon: any
          collapseIcon: any
        }) => {
          // console.log(rowExpand)

          if (React.isValidElement(rowExpand)) {
            return rowExpand
          }

          if (rowExpand) {
            if (expanded === 'loading') {
              return (
                <IconButton
                  className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
                  icon={defaultLoadingIcon}
                />
              )
            } else {
              return (
                <IconButton
                  tabIndex={-1}
                  className={cx(
                    `${prefixCls}__switcher`,
                    expanded
                      ? `${prefixCls}__switcher--expanded`
                      : `${prefixCls}__switcher--collapse`
                  )}
                  icon={expanded ? expandIcon : collapseIcon}
                  onClick={() => onNodeExpand(!expanded)}
                />
              )
            }
          }

          return null
        }

        const embedPanelColumn: TableColumnItem = {
          title: '',
          dataKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          // fixed: fixedColumn,
          // className: `${prefixCls}-row-expand-icon-cell`,
          width: 50,
          render: (_: any, rowItem: any, index: number) => {
            // const rowKey = getRowKey(rowItem, index)
            const rowKey = rowItem.key
            const sticky = true
            const rowExpand = isFunction(rowExpandable) ? rowExpandable(rowItem) : rowExpandable
            const expanded = isExpandEmbedRows(rowKey)

            // const sticky = flattedColumnsWithoutChildren.some((item) => {
            //   return (
            //     typeof item.leftStickyWidth !== 'undefined' || typeof item.rightStickyWidth !== 'undefined'
            //   )
            // })

            const switcherIcon = renderSwitcher({
              prefixCls,
              rowExpand,
              sticky,
              expanded,
              onNodeExpand: (shouldExpanded: boolean) => {
                onExpandEmbedRowsChange(rowItem, shouldExpanded)
              },
              expandIcon: defaultExpandIcon,
              collapseIcon: defaultCollapseIcon,
            })
            return switcherIcon
          },
        }

        return embedPanelColumn
      },
      [prefixCls, isExpandEmbedRows, onExpandEmbedRowsChange, rowExpandable]
    )

    const embedExpandable = useMemo(() => {
      if (!expandedRender) return false

      return {
        rowExpandable,
        expandEmbedRowKeys: expandEmbedRowKeysProp,
        onEmbedExpand,
        expandedRender,
      }
    }, [rowExpandable, expandEmbedRowKeysProp, onEmbedExpand, expandedRender])

    const mergedColumns = React.useMemo(() => {
      if (embedExpandable) {
        const embedColumn = getEmbedPanelColumn(embedExpandable)
        return [embedColumn, ...columns]
      }

      return columns
    }, [embedExpandable, getEmbedPanelColumn, columns])

    const extraHeader = extra && extra.header
    const extraFooter = extra && extra.footer

    const providedValue = useTable({ ...rest, columns: mergedColumns })

    const {
      bordered,
      size,
      leftFrozenColKeys,
      rightFrozenColKeys,
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
      scrollLeft,
      scrollRight,
    } = providedValue

    const hasBorder = borderedProp ?? bordered

    const cls = cx(
      prefixCls,
      className,
      hasBorder && `${prefixCls}--bordered`,
      striped && `${prefixCls}--striped`,
      size && `${prefixCls}--size-${size}`
    )

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项

    return (
      <div ref={ref} role={role} className={cls}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider value={providedValue}>
            <div style={{ position: 'relative' }}>
              <TableHeader prefixCls={prefixCls} />

              {/* 不跟随内部 header 横向滚动，固定到右侧 */}
              {extraHeader ? (
                <div style={{ position: 'absolute', right: 0, zIndex: 11, bottom: 0, top: 0 }}>
                  {extraHeader}
                </div>
              ) : null}
            </div>

            <TableBody prefixCls={prefixCls} />
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
      const clonedData = cloneTree(data)

      // @ts-ignore
      return flattenTree(clonedData, (node: any) => {
        // TODO: flattenTree 内置了 id 结构，需要处理 key 映射为 id
        return { ...node, id: getRowKeyField(node.raw) }
      })
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
          const { node, checked } = renderCell(_, rowItem, rowIndex)

          if (rowSelection!.render) {
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
          const { node, checked, semiChecked } = renderTitleCell()

          if (rowSelection.checkAllOptions && rowSelection.checkAllOptions.render) {
            return rowSelection.checkAllOptions.render(node)
          }

          return node
        }

        const selectionColumn: TableColumnItem = {
          width: checkboxColWidth,
          className: `${prefixCls}-selection-column`,
          title: renderSelectionTitleCell,
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
