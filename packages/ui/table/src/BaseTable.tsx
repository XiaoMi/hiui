import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { IconButton } from '@hi-ui/icon-button'
import { PlusSquareOutlined, MinusSquareOutlined } from '@hi-ui/icons'
import { isFunction } from '@hi-ui/type-assertion'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { defaultLoadingIcon } from './icons'
import { TableExtra, TableColumnItem, TableOnRowReturn } from './types'
import { TableProvider } from './context'
import { checkNeedTotalOrEvg, getTotalOrEvgRowData, uuid } from './utils'
import { useTable, UseTableProps } from './use-table'
import { useEmbedExpand, UseEmbedExpandProps } from './hooks/use-embed-expand'

const _role = 'table'
const _prefix = getPrefixCls('table')

export const EMBED_DATA_KEY = `TABLE_EMBED_DATA_KEY_${uuid()}`
const DEFAULT_COLUMNS = [] as []
const DEFAULT_DATA = [] as []

/**
 * TODO: What is BaseTable
 */
export const BaseTable = forwardRef<HTMLDivElement | null, BaseTableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      columns = DEFAULT_COLUMNS,
      data = DEFAULT_DATA,
      striped = false,
      bordered: borderedProp,
      // 内嵌面板
      rowExpandable,
      defaultExpandedEmbedRowKeys,
      expandedEmbedRowKeys,
      onEmbedExpand,
      expandedRender,
      // 其它
      size,
      extra,
      onRow,
      onHeaderRow,
      stickyFooter,
      stickyFooterBottom = 0,
      fixedColumnTrigger = 'auto',
      emptyContent,
      virtual,
      ...rest
    },
    ref
  ) => {
    // ********************** 内嵌式面板 *********************** //

    const {
      embedExpandable,
      onEmbedSwitch,
      isEmbedLoadingId,
      getEmbedPanelById,
      isExpandEmbedRows,
      onExpandEmbedRowsChange,
    } = useEmbedExpand({
      defaultExpandedEmbedRowKeys,
      rowExpandable,
      expandedEmbedRowKeys,
      onEmbedExpand,
      expandedRender,
    })

    /**
     * 表格列展开折叠操作区
     */
    const getEmbedPanelColumn = React.useCallback(
      (embedExpandable: any) => {
        const embedPanelColumn: TableColumnItem = {
          dataKey: EMBED_DATA_KEY,
          title: '',
          width: 38,
          className: `${prefixCls}__embed-col`,
          align: 'center',
          render: (_: any, rowItem: any) => {
            const { id: rowKey } = rowItem
            const { rowExpandable } = embedExpandable
            const rowExpand = isFunction(rowExpandable) ? rowExpandable(rowItem) : !!rowExpandable

            const expanded = isExpandEmbedRows(rowKey)
            const loading = isEmbedLoadingId(rowKey)

            return renderSwitcher({
              prefixCls,
              rowExpand,
              loading,
              expanded,
              onSwitch: (shouldExpanded: boolean) => {
                onExpandEmbedRowsChange(rowItem, shouldExpanded)
              },
              expandedIcon: <MinusSquareOutlined />,
              collapsedIcon: <PlusSquareOutlined />,
            })
          },
        }

        return embedPanelColumn
      },
      [prefixCls, isExpandEmbedRows, onExpandEmbedRowsChange, isEmbedLoadingId]
    )

    const mergedColumns = React.useMemo(() => {
      if (embedExpandable) {
        const embedColumn = getEmbedPanelColumn(embedExpandable)
        return [embedColumn, ...columns]
      }

      return columns
    }, [embedExpandable, getEmbedPanelColumn, columns])

    const i18n = useLocaleContext()

    // 确保包含 avg 属性，且值为数字类型的字符串
    const avgRow = { id: 'avg', raw: { key: 'avg' } }
    let hasAvgColumn = false

    columns.forEach((column, index) => {
      if (index === 0) {
        // @ts-ignore
        avgRow.raw[column.dataKey] = i18n.get('table.average')
      }
      if (checkNeedTotalOrEvg(data, column, 'avg')) {
        hasAvgColumn = true
        // @ts-ignore
        avgRow.raw[column.dataKey] = getTotalOrEvgRowData(data, column, true)
      }
    })

    // 确保包含total属性，且值为数字类型的字符串
    const sumRow = { id: 'sum', raw: { key: 'sum' } }
    let hasSumColumn = false

    columns.forEach((column, index) => {
      if (index === 0) {
        // @ts-ignore
        sumRow.raw[column.dataKey] = i18n.get('table.total')
      }
      if (checkNeedTotalOrEvg(data, column, 'total')) {
        hasSumColumn = true
        // 获取当前数据最大小数点个数，并设置最后总和值小数点
        // @ts-ignore
        sumRow.raw[column.dataKey] = getTotalOrEvgRowData(data, column, false)
      }
    })

    const providedValue = useTable({
      ...rest,
      columns: mergedColumns,
      data,
      virtual,
    })

    const {
      rootProps,
      bordered,
      leftFrozenColKeys,
      rightFrozenColKeys,
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
      scrollSize,
      getTableHeaderProps,
    } = providedValue

    const hasBorder = borderedProp ?? bordered

    const extraHeader = extra && extra.header
    const extraFooter = extra && extra.footer

    const alwaysFixedColumn = fixedColumnTrigger === 'always'

    const cls = cx(
      prefixCls,
      className,
      hasBorder && `${prefixCls}--bordered`,
      striped && `${prefixCls}--striped`,
      size && `${prefixCls}--size-${size}`,
      virtual && `${prefixCls}--virtual`
    )

    return (
      <div ref={ref} role={role} className={cls} {...rootProps}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider
            value={{
              ...providedValue,
              striped,
              onRow,
              embedExpandable,
              onEmbedSwitch,
              isExpandEmbedRows,
              onExpandEmbedRowsChange,
              getEmbedPanelById,
              isEmbedLoadingId,
              avgRow,
              hasAvgColumn,
              sumRow,
              hasSumColumn,
              virtual,
            }}
          >
            <div {...getTableHeaderProps()}>
              <TableHeader prefixCls={`${prefixCls}-header`} />

              {/* 不跟随内部 header 横向滚动，固定到右侧 */}
              {extraHeader ? (
                <div style={{ position: 'absolute', right: 0, zIndex: 11, bottom: 0, top: 0 }}>
                  {extraHeader}
                </div>
              ) : null}
            </div>

            <TableBody prefixCls={prefixCls} emptyContent={emptyContent} />
          </TableProvider>

          {/* 左冻结列内侧阴影效果 */}
          {(alwaysFixedColumn || scrollSize.scrollLeft > 0) && leftFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow  ${prefixCls}-freeze-shadow--left`}
              style={{ width: leftFixedColumnsWidth + 'px' }}
            />
          ) : null}

          {/* 右冻结列内侧阴影效果 */}
          {(alwaysFixedColumn || scrollSize.scrollRight > 0) && rightFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow ${prefixCls}-freeze-shadow--right`}
              style={{ width: rightFixedColumnsWidth + 'px' }}
            />
          ) : null}
        </div>
        <div
          className={`${prefixCls}-footer`}
          style={
            stickyFooter
              ? {
                  position: 'sticky',
                  bottom: stickyFooterBottom,
                  // boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1)'
                }
              : undefined
          }
        >
          {extraFooter}
        </div>
      </div>
    )
  }
)

export interface BaseTableProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDrop' | 'draggable' | 'onDragStart'>,
    UseTableProps,
    UseEmbedExpandProps {
  /**
   * 覆盖 header 的setting icon 和 footer 的 pagination。暂不对外暴露
   * @private
   */
  extra?: TableExtra
  /**
   *  是否展示为斑马纹效果
   */
  striped?: boolean
  /**
   * 表格内容行事件处理函数，对于统计行（合计或均值），rowData 为 null
   */
  onRow?: (rowData: Record<string, any> | null, index: number) => TableOnRowReturn
  /**
   * 行标题事件处理函数
   */
  onHeaderRow?: (columns: TableColumnItem[], index: number) => TableOnRowReturn
  /**
   *  数据为空时的展示内容
   */
  emptyContent?: React.ReactNode
  /**
   *  配置表格尺寸
   */
  size?: string
  /**
   * 底部吸底
   */
  stickyFooter?: boolean
  /**
   * 底部吸底距离视口底部距离
   */
  stickyFooterBottom?: number
  /**
   * 自定义冻结列触发展示行为
   */
  fixedColumnTrigger?: 'auto' | 'always'
}

if (__DEV__) {
  BaseTable.displayName = 'BaseTable'
}

const renderSwitcher = ({
  prefixCls,
  rowExpand,
  loading,
  expanded,
  onSwitch,
  expandedIcon,
  collapsedIcon,
}: any) => {
  if (React.isValidElement(rowExpand)) {
    return rowExpand
  }

  if (rowExpand === true) {
    if (loading) {
      return (
        <IconButton
          className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
          icon={defaultLoadingIcon}
        />
      )
    }

    return (
      <IconButton
        tabIndex={-1}
        className={cx(
          `${prefixCls}__switcher`,
          `${prefixCls}__switcher--${expanded ? 'expanded' : 'collapse'}`
        )}
        icon={expanded ? expandedIcon : collapsedIcon}
        onClick={(evt) => {
          // 阻止传递给 onRow 的 onClick 事件
          evt.stopPropagation()
          onSwitch(!expanded)
        }}
      />
    )
  }

  return null
}
