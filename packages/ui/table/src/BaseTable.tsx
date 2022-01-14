import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'
import { TableExtra, TableColumnItem } from './types'
import { useEmbedExpand, UseEmbedExpandProps } from './hooks/use-embed-expand'
import { IconButton } from '@hi-ui/icon-button'
import { PlusSquareOutlined, MinusSquareOutlined } from '@hi-ui/icons'
import { defaultLoadingIcon } from './icons'
import { isFunction } from '@hi-ui/type-assertion'
import { uuid } from './utils'

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
      extra,
      ...rest
    },
    ref
  ) => {
    // ********************** 内嵌式面板 *********************** //

    const {
      embedExpandable,
      onEmbedSwitch,
      isLoadingId,
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
          title: '',
          dataKey: EMBED_DATA_KEY,
          width: 50,
          align: 'center',
          render: (_: any, rowItem: any) => {
            const { id: rowKey } = rowItem
            const { rowExpandable } = embedExpandable
            const rowExpand = isFunction(rowExpandable) ? rowExpandable(rowItem) : !!rowExpandable

            const expanded = isExpandEmbedRows(rowKey)
            const loading = isLoadingId(rowKey)

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
      [prefixCls, isExpandEmbedRows, onExpandEmbedRowsChange, isLoadingId]
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
      <div ref={ref} role={role} className={cls}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider
            value={{
              ...providedValue,
              // expandedRender,
              // @ts-ignore
              embedExpandable,
              onEmbedSwitch,
              isExpandEmbedRows,
              onExpandEmbedRowsChange,
              getEmbedPanelById,
              isLoadingId,
            }}
          >
            <div style={{ position: 'relative' }}>
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
    UseTableProps,
    UseEmbedExpandProps {
  extra?: TableExtra
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
          expanded ? `${prefixCls}__switcher--expanded` : `${prefixCls}__switcher--collapse`
        )}
        icon={expanded ? expandIcon : collapseIcon}
        onClick={() => onSwitch(!expanded)}
      />
    )
  }

  return null
}
