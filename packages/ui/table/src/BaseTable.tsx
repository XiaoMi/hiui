import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useTable, UseTableProps } from './use-table'
import { TableProvider } from './context'
import { TableExtra } from './types'
import { useEmbedExpand } from './hooks/use-embed-expand'

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
      expandEmbedRowKeys,
      onEmbedExpand,
      expandedRender,
      extra,
      ...rest
    },
    ref
  ) => {
    // ********************** 内嵌式面板 *********************** //

    const { mergedColumns, isExpandEmbedRows, onExpandEmbedRowsChange } = useEmbedExpand({
      prefixCls,
      columns,
      rowExpandable,
      expandEmbedRowKeys,
      onEmbedExpand,
      expandedRender,
    })

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
              expandedRender,
              // @ts-ignore
              isExpandEmbedRows,
              onExpandEmbedRowsChange,
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
    UseTableProps {
  extra?: TableExtra
}

if (__DEV__) {
  BaseTable.displayName = 'BaseTable'
}
