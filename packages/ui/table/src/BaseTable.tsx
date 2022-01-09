import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'
import { TableColumnItem, TableExtra } from './types'
import { isFunction } from '@hi-ui/type-assertion'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheck } from '@hi-ui/use-check'
import { IconButton } from '@hi-ui/icon-button'
import { defaultLoadingIcon } from './icons'
import { PlusSquareOutlined, MinusSquareOutlined } from '@hi-ui/icons'

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
      rowExpandable = true,
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
      // idFieldName: 'key',
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
          console.log(rowExpand)

          if (React.isValidElement(rowExpand)) {
            return rowExpand
          }

          if (rowExpand) {
            // @ts-ignore
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
          width: 50,
          align: 'center',
          render: (_: any, rowItem: any, index: number) => {
            // const rowKey = getRowKey(rowItem, index)
            const rowKey = rowItem.id
            const sticky = true
            const rowExpand = isFunction(rowExpandable) ? rowExpandable(rowItem) : rowExpandable
            const expanded = isExpandEmbedRows(rowKey)

            const switcherIcon = renderSwitcher({
              prefixCls,
              rowExpand,
              sticky,
              expanded,
              onNodeExpand: (shouldExpanded: boolean) => {
                onExpandEmbedRowsChange(rowItem, shouldExpanded)
              },
              expandIcon: <MinusSquareOutlined />,
              collapseIcon: <PlusSquareOutlined />,
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

    const providedValue = useTable({ ...rest, columns: mergedColumns, expandedRender })

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

    // console.log('scrollLeft', scrollLeft, leftFrozenColKeys)

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项

    return (
      <div ref={ref} role={role} className={cls}>
        <div className={`${prefixCls}__wrapper`}>
          <TableProvider
            value={{
              ...providedValue,
              expandedRender,
              // @ts-ignore
              isExpandEmbedRows,
              onExpandEmbedRowsChange,
            }}
          >
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
