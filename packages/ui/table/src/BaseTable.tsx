import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { IconButton } from '@hi-ui/icon-button'
import { PlusSquareOutlined, MinusSquareOutlined } from '@hi-ui/icons'
import { isFunction } from '@hi-ui/type-assertion'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { defaultLoadingIcon } from './icons'
import { TableExtra, TableColumnItem, HeaderRowFunc } from './types'
import { TableProvider } from './context'
import { uuid } from './utils'
import { useTable, UseTableProps } from './use-table'
import { useEmbedExpand, UseEmbedExpandProps } from './hooks/use-embed-expand'

const _role = 'table'
const _prefix = getPrefixCls('table')

export const EMBED_DATA_KEY = `TABLE_EMBED_DATA_KEY_${uuid()}`
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
      columns = DEFAULT_COLUMNS,
      striped = false,
      bordered: borderedProp,
      // 内嵌面板
      rowExpandable,
      defaultExpandEmbedRowKeys,
      expandEmbedRowKeys,
      onEmbedExpand,
      expandedRender,
      // 其它
      size,
      extra,
      onHeaderRow,
      stickyFooter,
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
      defaultExpandEmbedRowKeys,
      rowExpandable,
      expandEmbedRowKeys,
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
          width: 50,
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
              expandIcon: <MinusSquareOutlined />,
              collapseIcon: <PlusSquareOutlined />,
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

    const providedValue = useTable({ ...rest, columns: mergedColumns })

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

    const cls = cx(
      prefixCls,
      className,
      hasBorder && `${prefixCls}--bordered`,
      striped && `${prefixCls}--striped`,
      size && `${prefixCls}--size-${size}`
    )

    return (
      <div ref={ref} role={role} className={cls} {...rootProps}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider
            value={{
              ...providedValue,
              embedExpandable,
              onEmbedSwitch,
              isExpandEmbedRows,
              onExpandEmbedRowsChange,
              getEmbedPanelById,
              isEmbedLoadingId,
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

            <TableBody prefixCls={prefixCls} />
          </TableProvider>

          {/* 左冻结列内侧阴影效果 */}
          {scrollSize.scrollLeft > 0 && leftFrozenColKeys.length > 0 ? (
            <div
              className={`${prefixCls}-freeze-shadow  ${prefixCls}-freeze-shadow--left`}
              style={{ width: leftFixedColumnsWidth + 'px' }}
            />
          ) : null}

          {/* 右冻结列内侧阴影效果 */}
          {scrollSize.scrollRight > 0 && rightFrozenColKeys.length > 0 ? (
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
                  bottom: 0,
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
  extra?: TableExtra
  /**
   *  是否展示为斑马纹效果
   */
  striped?: boolean
  /**
   * 行标题事件处理函数
   */
  onHeaderRow?: HeaderRowFunc
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
  expandIcon,
  collapseIcon,
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
        icon={expanded ? expandIcon : collapseIcon}
        onClick={() => onSwitch(!expanded)}
      />
    )
  }

  return null
}
